var cheerio = require("cheerio");

module.exports = function(params, callback) {
  var self = this;
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
            var j = self.helpers.getJsonFromUrl(url);
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