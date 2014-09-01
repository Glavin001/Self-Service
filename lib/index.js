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

    // Source: http://stackoverflow.com/a/8486188/2578205
    function getJsonFromUrl(url) {
      var query = url.split('?')[1];
      var data = query.split("&");
      var result = {};
      for(var i=0; i<data.length; i++) {
        var item = data[i].split("=");
        result[item[0]] = item[1];
      }
      return result;
    }
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

    self.getCourse = function(params, callback) {
        params = params || { };
        var term = params.term_in;
        var crn = params.crn;
        var subj = "%";
        var crse = "%";

        var referer = "bwskfshd.P_CrseSchd";
        //var url = "bwckschd.p_disp_listcrse?term_in="+term+"&subj_in="+subj+"&crse_in="+crse+"&crn_in="+crn+"";
        var url = "bwskfshd.P_CrseSchdDetl?term_in="+term+"&crn="+crn;
        //console.log(url);

        var options = {
            method: "GET",
            url: self.baseURL + url,
            headers: {
                "User-Agent": self.userAgent,
                "Referer": self.baseURL + referer
                //, "Cookie": testCookie
            },
            jar: self.cookieJar
        };

        //
        return self.request(options, function (error, response, body) {
            //console.log('\n=== Done Request ===', error, response.statusCode);
            var course = { };
            //console.log(error, response);
            //console.log('crn: ', crn);

            var $ = cheerio.load(body);
            //console.log('Done loading.');

            var $datadisplaytable = $('.datadisplaytable');
            var $table1 = $($datadisplaytable[0]);
            var $table2 = $($datadisplaytable[1]);

            var $values = $('.dddefault', $table2);

            //console.log("StatusCode: ", response.statusCode);

            if (
                response.statusCode !== 200 ||
                $values.length === 0
                ) {

                //console.error('====== WAS NOT SUCCESSFUL');

                //console.log($values.html());
                //console.log($.html());
                //console.log($datadisplaytable.html());
                //console.log($table1.html());
                //console.log($table2.html());

                error = error || new Error("Could not read course with CRN '"+crn+"'. Request response with Status Code "+ response.statusCode+".");

            } else {

                for (var i=0, len=$values.length; i<len; i++) {
                    var $curr = $($values[i]);
                    //console.log("Value: ", i,  $curr.html());
                }

                course.title = $('.captiontext', $table1).text();
                course.crn = crn;

                var dateRangeStr = $($values[4]).text();
                //console.log(dateRangeStr);

                course.type = $($values[0]).text();
                var timeStr = $($values[1]).text();
                var time = {
                    start: timeStr.split(' - ')[0],
                    end: timeStr.split(' - ')[1]
                };
                course.time = time;
                course.days = $($values[2]).text().split('');
                course.location = $($values[3]).text();

                course.startDate = new Date(dateRangeStr.split(' - ')[0]);
                course.endDate = new Date(dateRangeStr.split(' - ')[1]);

                course.scheduleType = $($values[5]).text();
                course.instructors = $($values[6]).text();

            }

            callback(error, response, course);

        });

    };

    // Week at a Glance
    self.weekAtAGlance = function(params, callback) {
        var url = self.baseURL + "bwskfshd.P_CrseSchd";
        var referer = "twbkwbis.P_GenMenu?name=bmenu.P_RegMnu";
        params = params || { };
        var SESSID = params.SESSID;
        var startDateIn = params.startDate;

        if (SESSID) {
            // Setup Cookie Session
            var sessionCookie = "SESSID="+SESSID;
            var cookie = self.request.cookie(sessionCookie);
            self.cookieJar.setCookie(cookie, self.baseURL, function (err, cookie){});
        }

        if (startDateIn) {
            var m = startDateIn;
            var dateStr = m.getUTCDate() + "/" + (m.getUTCMonth()+1) + "/" + m.getUTCFullYear();
            url += "?start_date_in="+dateStr;
        }

        var options = {
            url: url,
            headers: {
                "User-Agent": self.userAgent,
                "Referer": self.baseURL + referer
                //, "Cookie": sessionCookie
            },
            jar: self.cookieJar
        };

        //
        return self.request(options, function (error, response, body) {
            //console.log('Completed request', error, response, body);
            if (!error && response.statusCode == 200) {
                // console.log(body) // Print the google web page.
                // Process Body into an array of Courses
                var $ = cheerio.load(body);
                var $table = $('.datadisplaytable');
                var $a = $('a', $table);
                var urls = [ ];
                var i = 0;
                for (i=0, len=$a.length; i<len; i++) {
                    var href = $($a[i]).attr('href');
                    urls.push(href);
                }
                //console.log(urls);
                urls = urls.getUnique();
                //console.log(urls);
                var courses1 = [];
                for (i=0, len=urls.length; i<len; i++) {
                    var url = urls[i];
                    var j = getJsonFromUrl(url);
                    //console.log(j);
                    courses1.push(j);
                }
                //console.log(courses1);
                var courses2 = [ ];
                var pendingCourses = 0;
                var completionCallback = function() {
                    if (pendingCourses <= 0) {
                        callback(error, response, courses2);
                    }
                };
                for (i=0, len=courses1.length; i<len; i++) {
                    (function(i) {
                        //console.log("Processing course: ", courses1[i]);
                        pendingCourses++;
                        self.getCourse(courses1[i], function(error, response, data) {
                            if (!error) {
                                courses2.push(data);
                                pendingCourses--;
                                completionCallback();
                            } else {
                                // An error occured.
                                // Instead of having Self-Service retry the request,
                                // it will callback with an error argument,
                                // giving the user of Self-Service the opportunity to retry.
                                callback(error, response, courses2);
                            }
                        });
                    })(i); // jshint ignore: line
                }
                //
                completionCallback();
            } else {
                callback(error, response, {});
            }
        });

        //return self;
    };

    self.login = function(params, callback) {
        params = params || { };
        var username = params.username;
        var password = params.password;

        var url = self.baseURL + "twbkwbis.P_ValLogin";
        var referer = "twbkwbis.P_WWWLogin";

        // Setup Cookie Session
        var testCookie = "TESTID=set";
        var cookie = self.request.cookie(testCookie);
        self.cookieJar.setCookie(cookie, self.baseURL, function (err, cookie){

            var options = {
                method: "POST",
                url: url,
                headers: {
                    "User-Agent": self.userAgent,
                    "Referer": self.baseURL + referer,
                    "Cookie": testCookie
                },
                jar: self.cookieJar,
                form: {
                    "sid": username,
                    "PIN": password
                }
            };

            //
            return self.request(options, function (error, response, body) {
                //console.log('Completed request', error, response, body);
                /*
                if (!error && response.statusCode == 200) {
                    console.log(body) // Print the google web page.
                }
                */

                //self.request = request.request;

                //console.log(error, response.statusCode);
                console.log(response);
                //console.log( self.cookieJar );

                callback(error, response, self);
            });

        });
    };

    return self;
};
