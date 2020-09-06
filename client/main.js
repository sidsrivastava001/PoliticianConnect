import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

import './main.html';
import './constants.html';
import './questions.html';
import './ranks.html';

import "./questions.js"
import "./ranks.js"

Session.setDefault("showProfileDropdown", false);

//Show constituent signup by default
Session.setDefault("showPoliticianSignUp", false);

Session.set("page", "Home");


Template.navbar.events({
  "click #x": function(event) {
    event.preventDefault();
    console.log(event.target.text);
    console.log("Pressed");
    if(event.target.text == "Questions") {
      if(Meteor.user().profile.role == "representative") {
        Session.set("page", "questionsPolitician");
      }
      else {
        Session.set("page", "questionsUser");
      }
    }
    if(event.target.text == "Home") {
      Session.set("page", "Home")
    }
    if(event.target.text == "Answered") {
      Session.set("page", "answered")
    }
    if(event.target.text == "Ranks") {
      Session.set("page", "Ranks")
    }
    //console.log(Session.get("page"));
  }
})
Template.body.helpers({
  questionsPol() {
    if(Session.get("page") == "questionsPolitician") {
      console.log(Session.get("page"));
      return true;
    }
    return false;
  },
  questionsUse() {
    if(Session.get("page") == "questionsUser") {
      console.log(Session.get("page"));
      return true;
    }
    return false;
  },
  answer() {
    if(Session.get("page") == "answered") {
      console.log(Session.get("page"));
      return true;
    }
    return false;
  },
  homeRet() {
    if(Session.get("page") == "Home") {
      console.log(Session.get("page"));
      return true;
    }
    return false;
  },
  ranksRet() {
    if(Session.get("page") == "Ranks") {
      console.log(Session.get("page"));
      return true;
    }
    return false;
  }
})

Template.home.helpers({
  signingUp: function() {
    console.log(AccountsTemplates.getState());
    return AccountsTemplates.getState() == "signUp";
  },
  loggedIn: function() {
    return Meteor.user() != null ? true : false;
  },
  getUser: function(){
    return Meteor.user().profile;
  },
  getName: function() {
    return Meteor.user().profile.name;
  },
  isPolitician: function() {
    return Meteor.user().profile.role == "representative";
  }
});

Template.profileDropdown.events({
  'click .dropdown-toggle': function (event) {
    Session.set("showProfileDropdown", !Session.get("showProfileDropdown"));
  },
  'click .sign-out': function (event) {
    console.log(Meteor.user());
    Session.set("showProfileDropdown", false);
    AccountsTemplates.logout();
  },
});

Template.profileDropdown.helpers({
  showProfileMenu: function() {
    return Session.get("showProfileDropdown");
  },
  loggedIn: function() {
    return Meteor.user() != null ? true : false;
  },
  getName: function() {
    return Meteor.user().profile.name;
  }
});

Template.signUpConfig.events({
  "click .sign-up-switch": function (event) {
    Session.set("showPoliticianSignUp", !Session.get("showPoliticianSignUp"));
  }
});

Template.signUpConfig.helpers({
  showPoliticianSignUp: function() {

    return Session.get("showPoliticianSignUp");
  },
  textValue: function() {
    return Session.get("showPoliticianSignUp") ? "representative" : "constituent";
  }
});

AccountsTemplates.configure({
  preSignUpHook: function(password, info) {

    if(Session.get("showPoliticianSignUp")) {

      info.profile.role = "representative";
      info.profile.replyCount = 0;
    } else {
      info.profile.role = "constituent";
    }
    
  }
})

// User accounts documentation: https://github.com/meteor-useraccounts/core/blob/master/Guide.md#form-fields-configuration
AccountsTemplates.addFields([
  {
    _id: "name",
    type: "text",
    placeholder: "Name",
    displayName: "Name",
    required: true,
  },
  {
    _id: "home_address",
    type: "text",
    placeholder: "Home Address",
    displayName: "Home Address",
    required: true,
  },
]);

//var x = fetch('https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=416%20Vanderveer%20Road%20Bridgewater%20NJ%2008807&levels=country&roles=legislatorLowerBody&key=AIzaSyDB5e9LPNi72wi_R7wqCw6VFmloaQZ0jmM');
//console.log(x);