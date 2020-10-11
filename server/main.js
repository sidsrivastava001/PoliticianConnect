import { Meteor } from 'meteor/meteor';
import { Posts } from '../imports/posts.js';
import { HTTP } from 'meteor/http';
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser((options, user) => {
  console.log(options);
  //var reps = {};
  
  options.profile.governor = Meteor.call('getGovernor', options.profile.home_address)[0];
  options.profile.representative = Meteor.call('getLocalPolitician', options.profile.home_address)[0];
  options.profile.senator1 = Meteor.call('getStatePolitician', options.profile.home_address)[0][0];
  options.profile.senator2 = Meteor.call('getStatePolitician', options.profile.home_address)[1][0];
  user.profile = options.profile;
  console.log(user);
  return user;
});

const storage = new Storage({
  keyFilename: "/home/victor/Documents/Meteor/PoliticianConnect/server/key.json",
  projectId: "politicianconnector"});

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  newPost(user, heading, blog, rep){
    var head = heading.replace(' ', "%20");
    var tag = HTTP.call('get', ('http://sidsrivastava.pythonanywhere.com/?string='+head)).content;
    var now = new Date();
    var str;
    
    str = now.getMonth()+1 + ' ';
    if(now.getMonth()+1 == 9){
        str = "September ";
    }
    str += now.getDate() + ", " + now.getFullYear();
    Posts.insert({
      username: user,
      heading: heading,
      body: blog,
      date: str,
      tag: tag,
      politician: rep,
      stars: 0,
      answered: false,
      answer: "f",
      answerVid: "f"
    });
    return tag;
  },
  getLocalPolitician(address){
    var add = address.replace(" ", "%20")
    var x = HTTP.call('GET', 'https://civicinfo.googleapis.com/civicinfo/v2/representatives?address='+ add + '&levels=country&roles=legislatorLowerBody&key=AIzaSyDB5e9LPNi72wi_R7wqCw6VFmloaQZ0jmM');
    var y = x.data['officials'];
    var arr = [];

      arr.push(y[0]['name']);
      arr.push(y[0]['party']);
      arr.push(y[0]['urls'][0]);
      
    
    
    return arr;
  },
  getGovernor(address){
    var add = address.replace(" ", "%20")
    var x = HTTP.call('GET', 'https://civicinfo.googleapis.com/civicinfo/v2/representatives?address='+ add + '&levels=administrativeArea1&roles=headOfGovernment&key=AIzaSyDB5e9LPNi72wi_R7wqCw6VFmloaQZ0jmM');
    var y = x.data['officials'];
    var arr = [];

      arr.push(y[0]['name']);
      arr.push(y[0]['party']);
      arr.push(y[0]['urls'][0]);
    
    
    
    return arr;
  },
  getStatePolitician(address){
    var add = address.replace(" ", "%20")
    var x = HTTP.call('GET', 'https://civicinfo.googleapis.com/civicinfo/v2/representatives?address='+ add + '&levels=country&roles=legislatorUpperBody&key=AIzaSyDB5e9LPNi72wi_R7wqCw6VFmloaQZ0jmM');
    var y = x.data['officials'];
    var arr = [];

    for(var a=0; a<y.length; a++){
      var z = [];
      z.push(y[a]['name']);
      z.push(y[a]['party']);
      z.push(y[a]['urls'][0]);
      arr.push(z);
    }
    
    
    return arr;
  },
  async fileupload(fileInfo, fileData, politician){
    var rep = politician.toLowerCase();
    rep = rep.split(' ').join('-');
    const [buckets] = await storage.getBuckets();
    var contains = false;
    var array = []
    buckets.forEach(bucket => {
      if(bucket.name == rep){
        contains = true;
      }
      array.push(bucket.name);
    });
    if(!contains){
      await storage.createBucket(rep);
    }

    console.log(fileInfo);
    console.log("TESTING THE NAME");
    console.log(fileInfo.name);
    fs.writeFile('tom.mp4', new Buffer(fileData, 'binary'), (err, res) => {
      console.log('CALLBACK WORKED');
      
    });
    await storage.bucket(rep).upload('tom.mp4', {
      resumable: false, //set to true when uploading videos
      gzip:true,
      destination:'malinowski2020.mp4'
    });
  },
  async getVideo(politician){
    var rep = politician.toLowerCase();
    rep = rep.split(' ').join('-');
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 600 * 60 * 1000
    };
    const [url] = await storage.bucket(rep).file('malinowski2020.mp4').getSignedUrl(options);
    return url;
  },
  async uploadVideo(politician, postHeader, filepath){
    //check if politician's bucket is created
    var rep = politician.toLowerCase();
    rep.replace(" ", "-");
    const [buckets] = await storage.getBuckets();
    var contains = false;
    var array = []
    buckets.forEach(bucket => {
      if(bucket.name == rep){
        contains = true;
      }
      array.push(bucket.name);
    });
    if(!contains){
      await storage.createBucket(rep);
    }
    await storage.bucket(politician).upload(filepath, {
      resumable: false, //set to true when uploading videos
      gzip:true,
      destination:postHeader
    });
    return array;
    },
    async testingBuckets(){
      const [buckets] = await storage.getBuckets();
      var arr = [];
    buckets.forEach(bucket => {
      arr.push(bucket.name);
    });
    return arr;
    },
  async create(){
    await storage.createBucket('amanisannoying');
    return ('Complete');
  },
  testingDatabase(){
    var x = Posts.find().fetch();
    return x;
  },
  showingPosts(politician, sortBy){
    var x = Posts.find({politician:politician, answered:false}).fetch();
    console.log(x);
    var finalArr = [];
    if(sortBy == "Newest") {
      finalArr = x.sort(Meteor.call('getDecSortOrder', 'date'));
    }
    else {
      finalArr = x.sort(Meteor.call('getDecSortOrder', 'stars'));
    }
    return finalArr;
  },
  getDecSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}    ,
  deleteStuff(){
    Posts.delete({});
  },
  reply(politician, body, answer){
    var x = Posts.findOne({politician:politician, body:body});
    console.log(x);
    Posts.upsert(x, {username:x.username, stars:x.stars, body:body, heading:x.heading, date:x.date, politician:politician, tag:x.tag, answerVid: 'f', answered: true, answer:answer});

  },
  answeredPosts(politician){
    var x = Posts.find({politician:politician,answered:true}).fetch();
    return x;
  },
  upvoted(politician, body){
    var x = Posts.findOne({politician:politician, body:body});
    console.log(x.stars+1);
    Posts.upsert(x, {username:x.username, stars:(x.stars+1), body:body, heading:x.heading, date:x.date, politician:politician, tag:x.tag, answerVid: x.answerVid, answered: x.answered, answer:x.answer});
  },
  filter(tag, politician) {
    var x = Posts.find({politician:politician, tag:tag, answered:false}).fetch();
    return x;
  }
});
