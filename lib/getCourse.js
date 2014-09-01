var cheerio = require("cheerio");

module.exports = function(params, callback) {
  var self = this;
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
