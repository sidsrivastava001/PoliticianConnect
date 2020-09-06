import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

import './ranks.html';

Session.set("num", 0);

Template.ranks.helpers({
    retUsers() {
        var x = []
        Meteor.users.find().forEach(function(user) {
            if(user.profile.role == "representative") {
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
    retPlace(x) {
        return x+1
    }
})

