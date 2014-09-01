// index.js

/*!
 * Module dependencies.
 */
var request = require("request");
var cheerio = require("cheerio");

/*
Export Module
*/
module.exports = selfService = function (url) {

    // Self referential
    var self = this;

    // Setup
    self.cookieJar = request.jar();
    self.request = request.defaults({ jar: self.cookieJar });

    // Properties
    self.domainURI = url || "https://ssb-nlive.smu.ca";
    self.baseURL = self.domainURI+"/pls/sNLIVE/";
    self.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36";

    // Source: http://stackoverflow.com/a/1961068/2578205
    Array.prototype.getUnique = function(){
       var u = {}, a = [];
       for(var i = 0, l = this.length; i < l; ++i){
          if(u.hasOwnProperty(this[i])) {
             continue;
          }
          a.push(this[i]);
          u[this[i]] = 1;
       }
       return a;
    };
    self.helpers = require('./helpers');
    self.getCourse = require('./getCourse');
    self.weekAtAGlance = require('./weekAtAGlance');
    self.getCoursesSchedule = require('./getCoursesSchedule');
    self.login = require('./login');
    
    return self;
};
