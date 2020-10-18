import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

import './ranks.html';

Session.set("num", 0);
Session.set('socials', []);

Template.ranks.helpers({
    retUsers() {
        var x = []
        Meteor.users.find().forEach(function(user) {
            if(user.profile.role == "representative") {
                var arr = [];
                console.log("NAME: " + user.profile.name)
                console.log("GOVERNER: " + user.profile.governor);
                console.log("REP: " + user.profile.representative);
                console.log("SEN1: " + user.profile.senator1);
                console.log("SEN2: " + user.profile.senator2);
                x.push(user);
            }
            
        });
        
        x.sort((a, b) => (a.profile.replyCount > b.profile.replyCount) ? -1 : 1)
        
        for(var i=0; i<x.length; i++) {
            x[i].place = i+1;
            
        }
        console.log(x);
        return x;
    },
    retSocials(user) {
        if(user.profile.name == user.profile.governor) {
            arr = {facebook: "https://www.facebook.com/" + user.profile.governorFacebook, twitter: "https://www.twitter.com/" + user.profile.governorTwitter}
        }
        else if(user.profile.name == user.profile.representative) {
            arr = {facebook: "https://www.facebook.com/"+ user.profile.representativeFacebook, twitter: "https://www.twitter.com/" + user.profile.representativeTwitter}
        }
        else if(user.profile.name == user.profile.senator1) {
            arr = {facebook: "https://www.facebook.com/"+ user.profile.senator1Facebook, twitter: "https://www.twitter.com/" + user.profile.senator1Twitter}
        }
        else if(user.profile.name == user.profile.senator2) {
            arr = {facebook: "https://www.facebook.com/"+user.profile.senator2Facebook, twitter: "https://www.twitter.com/" + user.profile.senator2Twitter}
        }
        console.log(arr);
        Session.set('socials', arr);
    },
    getSocials() {
        return Session.get('socials', arr);
    },
    retPlace(x) {
        return x+1
    }
})

