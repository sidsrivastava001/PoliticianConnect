import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Blaze } from 'meteor/blaze'

import './main.html';
import './constants.html';
import './questions.html';

Session.set("politician", "None");
Session.set("Filter tag", "None");
Session.set('post', []);
Session.set('answered', []);
Session.set('politicianPost', []);
Session.set('Sort', 'Newest');
Session.set("header", "none");
Session.set('tom', ' ');

Template.questionsPolitician.onRendered(function(){

    this.autorun(function(){
      Template.currentData();
    });
 
 });

 Template.questionsUser.onRendered(function(){

    this.autorun(function(){
      Template.currentData();
    });
 
 });


Template.questionsPolitician.helpers({
    displayPosts: function() {
            if(Session.get('Filter tag') == 'None') {
                
                Meteor.call('showingPosts', Meteor.user().profile.name, Session.get('Sort'),
                    (err, res) => {
                        if(err) {
                            console.log("Err");
                        }
                        else {
                            Session.set('politicianPost', res);
                            console.log("Result", res);
                        }
                        
                    })
                }
                else{
                    Meteor.call('filter', Session.get('Filter tag'), Meteor.user().profile.name,
                    (err, res) => {
                        if(err) {
                            console.log("Err");
                        }
                        else {
                            Session.set('politicianPost', res);
                            console.log("Result", res);
                        }
                    })
                }



    },
    returnPosts: function() {
        return Session.get('politicianPost');
    },
    setPost: function(header) {
        Session.set("header", header);
    }
})

Template.questionsPolitician.events({
    'submit form': function(event) {
        event.preventDefault();  
        
        //Increase reply count by 1
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.replyCount": Meteor.user().profile.replyCount + 1}});

        x = event.target.getElementsByTagName("input")[0].value;
        y = event.target.getElementsByTagName("textarea")[0].value;
        z = event.target.getElementsByTagName("button")[0].name;
        console.log("Submitted");
        console.log(x);
        console.log(y);
        console.log(z);
        console.log(Meteor.user().emails[0].address);
        event.target.getElementsByTagName("input")[0].value = '';
        event.target.getElementsByTagName("textarea")[0].value = '';
        Meteor.call('reply', Meteor.user().profile.name, z, y, (err, res) => {
            if(err) {
                console.log("Error");
            }
            else {
                console.log("res");
            }
        });
    },
    'change .custom-file-input': function(event, template){
        var func = this;
        var file = event.currentTarget.files[0];
        console.log("File" + file);
        var reader = new FileReader();
        reader.onload = function(fileLoadEvent) {
            console.log("File" + file + "Reader" + reader.result)
           Meteor.call('fileupload', file, reader.result, Meteor.user().profile.name,
           (err, res) => {
               if(err) {
                   console.log(err);
               }
               console.log("FILE UPLOADED");
           });
        };
        reader.readAsBinaryString(file);
     }
})


Template.questionsUser.helpers({
    displayPosts: function() {
        if(Session.get('Filter tag') == 'None') {
        Meteor.call('showingPosts', Session.get('politician'), Session.get('Sort'),
            (err, res) => {
                if(err) {
                    console.log("Err");
                }
                else {
                    Session.set('post', res);
                }
                
            })
        }
        else{
            Meteor.call('filter', Session.get('Filter tag'), Session.get('politician'),
            (err, res) => {
                if(err) {
                    console.log("Err");
                }
                else {
                    Session.set('post', res);
                }
            })
        }
    },
    returnPosts: function() {
        return Session.get('post');
    },
    politicianSelected: function() {
        return (Session.get("politician") != "None");
    },
    getCurrentPoliticianName: function() {
        return Session.get("politician");
    }
})

Template.questionsUser.events({
    "submit form": function(event) {
        event.preventDefault();
        x = event.target.getElementsByTagName("input")[0].value;
        y = event.target.getElementsByTagName("textarea")[0].value;
        console.log("Submitted");
        console.log(x);
        console.log(y);
        console.log(Meteor.user().emails[0].address);
        event.target.getElementsByTagName("input")[0].value = '';
        event.target.getElementsByTagName("textarea")[0].value = '';
        Meteor.call('newPost', Meteor.user().emails[0].address, x, y, Session.get('politician'),
        (err, res) => {  console.log('Uploaded to database');   })
        if(Session.get('Filter tag') == 'None') {
            Meteor.call('showingPosts', Session.get('politician'), Session.get('Sort'),
                (err, res) => {
                    if(err) {
                        console.log("Err");
                    }
                    else {
                        Session.set('post', res);
                    }
                    
                })
            }
            else{
                Meteor.call('filter', Session.get('Filter tag'), Session.get('politician'),
                (err, res) => {
                    if(err) {
                        console.log("Err");
                    }
                    else {
                        Session.set('post', res);
                    }
                })
            }
        
    },
    "click #hello"(event) {
        event.preventDefault();
        var vote = event.target.name;
        console.log(vote);
        Meteor.call('upvoted', Session.get('politician'), vote, 
        (err, res) => {
            console.log('done');
        })
    }
    
})

Template.answered.helpers({
    displayPosts: function() {
        Meteor.call('answeredPosts', Session.get('politician'),
        (err, res) => {
            if(err) {
                console.log("Err");
            }
            else {
                Session.set('answered', res);
            }
            
        })
    },
    returnPosts: function() {
        return Session.get('answered');
    },
    isPolitician: function() {

        if(Meteor.user().profile.role == "representative") Session.set("politician", Meteor.user().profile.name);
        return Meteor.user().profile.role == "representative";
    },
    setURL(){
        Meteor.call('getVideo', Meteor.user().profile.name, 
        (err, res) => {
            Session.set('tom', res);
        })
    },
    getURL(){
        console.log(Session.get('tom'));
        Session.get('tom');
    }
})



Template.polticianButton.helpers({
    getReps: function(){
        console.log(Meteor.user());
        return Meteor.user().profile;
    }
})

Template.polticianButton.events({
    "click .dropdown-menu": function(event) {
        event.preventDefault();
        x = event.target.text;
        Session.set("politician", x);
        console.log(x);
        console.log("a");
    }
})



Template.filterButton.events({

    "click .dropdown-menu": function(event) {
        event.preventDefault();
        x = event.target.text;
        Session.set('Filter tag', x);
        console.log(x);
        console.log("a");
    }

});

Template.sortByButton.events({
    "click .dropdown-menu": function(event) {
        event.preventDefault();
        x = event.target.text;
        Session.set('Sort', x);
        console.log(x);
        console.log("a");
    }
})
