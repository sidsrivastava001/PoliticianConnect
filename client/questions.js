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

 



Template.questionsPolitician.helpers({
    displayPosts: function() {
        console.log("SID IS AN IDIOT");
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
})

Template.questionsPolitician.events({
    'submit form': function(event) {
        event.preventDefault();
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
