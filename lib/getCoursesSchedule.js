var cheerio = require("cheerio");

module.exports = function(params, callback) {
  var self = this;
  /*
  // Available Params
    term_in:201510
    sel_subj:dummy
    sel_day:dummy
    sel_schd:dummy
    sel_insm:dummy
    sel_camp:dummy
    sel_levl:dummy
    sel_sess:dummy
    sel_instr:dummy
    sel_ptrm:dummy
    sel_attr:dummy
    sel_subj:ACCT
    sel_crse:
    sel_title:
    sel_insm:%
    sel_from_cred:
    sel_to_cred:
    sel_levl:%
    sel_instr:%
    sel_attr:%
    begin_hh:0
    begin_mi:0
    begin_ap:a
    end_hh:0
    end_mi:0
    end_ap:a
    */
  params = params || { };
  function d(name, v) {
    params[name] = params[name] || v;
  }
  // Default to dummy
  d('term_in', 'dummy');
  d('sel_subj', 'dummy');
  d('sel_day', 'dummy');
  d('sel_schd', 'dummy');
  d('sel_insm', 'dummy');
  d('sel_instr', 'dummy');
  d('sel_camp', 'dummy');
  d('sel_levl', 'dummy');
  d('sel_sess', 'dummy');
  d('sel_instr', 'dummy');
  d('sel_ptrm', 'dummy');
  d('sel_attr', 'dummy');
  d('sel_ptrm', 'dummy');
  // Default to empty
  d('sel_subj', '');
  d('sel_crse', '');
  d('sel_title', '');
  d('sel_from_cred', 'dummy');
  d('sel_to_cred', 'dummy');
  // Default to %
  d('sel_insm', '%');
  d('sel_levl', '%');
  d('sel_instr', '%');
  d('sel_attr', '%');
  // Default to 0
  d('begin_hh', 0);
  d('begin_mi', 0);
  d('begin_ap', 0);
  d('end_hh', 0);
  d('end_mi', 0);
  d('end_ap', 0);

  // console.log(params);

  // // Generate Form Data string for request
  var dataStr = "term_in="+params.term_in+"&"+
                  //"sel_subj="+params.sel_subj+"&"+
                  "sel_subj=dummy&"+
                  "sel_day="+params.sel_day+"&"+
                  "sel_schd="+params.sel_schd+"&"+
                  "sel_insm="+params.sel_insm+"&"+
                  "sel_camp="+params.sel_camp+"&"+
                  "sel_levl="+params.sel_levl+"&"+
                  "sel_sess="+params.sel_sess+"&"+
                  "sel_instr="+params.sel_instr+"&"+
                  "sel_ptrm="+params.sel_ptrm+"&"+
                  "sel_attr="+params.sel_attr+"&"+
                  "sel_subj="+params.sel_subj+"&"+
                  "sel_crse="+params.sel_crse+"&"+
                  "sel_title="+params.sel_title+"&"+
                  "sel_insm=%&"+
                  "sel_from_cred=&"+
                  "sel_to_cred=&"+
                  "sel_levl=%&"+
                  "sel_instr=%&"+
                  "sel_attr=%&"+
                  "begin_hh="+params.begin_hh+"&"+
                  "begin_mi="+params.begin_mi+"&"+
                  "begin_ap="+params.begin_ap+"&"+
                  "end_hh="+params.end_hh+"&"+
                  "end_mi="+params.end_mi+"&"+
                  "end_ap="+params.end_ap+"";
  // console.log(dataStr);

  var referer = "bwckgens.p_proc_term_date";
  var url = "bwckschd.p_get_crse_unsec";

  var options = {
    method: "POST",
    url: self.baseURL + url + "?" + dataStr,
    headers: {
      "User-Agent": self.userAgent,
      "Referer": self.baseURL + referer
          //, "Cookie": testCookie
        },
        jar: self.cookieJar
      };

  //
  r = self.request(options, function (error, response, body) {
      // console.log('\n=== Done Request ===', error, response);
      var $ = cheerio.load(body);
      console.log('Done loading.');
      // 
      var $datadisplaytables = $('.pagebodydiv>.datadisplaytable');
      var $datadisplaytable = $($datadisplaytables[0]);
      var $rows = $datadisplaytable.children('tr');
      var $headings = $rows.children('th');
      var $bodies = $rows.children('td');

      var courses = [];
      for (var i=0, len=$headings.length; i<len; i++) {
        // console.log('================ '+i+' ==============');
        var $h = $($headings[i]);
        var $b = $($bodies[i]);
        var $a = $('a', $h);
        // console.log($h, $a);
        var r = /(.*) - ([0-9]*) - (.{4}) ([0-9]{4}) - (.*)/;
        var h = $a.html();
        var hs = h.match(r);
        // console.log(hs);
        // if (!hs) {
        //   console.log($a.html());
        //   console.log('error');
        // }
        var title = hs[1];
        var crn = parseInt(hs[2]);
        var subject = hs[3];
        var courseNumb = hs[4];
        var seqNumb = hs[5];
        // TODO: Process Course HTML
        var course = {
          title: title,
          crn: crn,
          subject: subject,
          courseNumb: courseNumb,
          seqNumb: seqNumb
        }

        // if (!title) {
        //   console.log($h.html(), $b.html());
        //   console.log('error');
        // }

        // 
        courses.push(course);
      }

      // var $table1 = $($datadisplaytable[0]);
      // var $table2 = $($datadisplaytable[1]);

      // var $values = $('.dddefault', $table2);

      // //console.log("StatusCode: ", response.statusCode);

      // if (
      //   response.statusCode !== 200 ||
      //   $values.length === 0
      //   ) {

      //     //console.error('====== WAS NOT SUCCESSFUL');

      //     //console.log($values.html());
      //     //console.log($.html());
      //     //console.log($datadisplaytable.html());
      //     //console.log($table1.html());
      //     //console.log($table2.html());

      //     error = error || new Error("Could not read course with CRN '"+crn+"'. Request response with Status Code "+ response.statusCode+".");

      //   } else {

      //     for (var i=0, len=$values.length; i<len; i++) {
      //       var $curr = $($values[i]);
      //         //console.log("Value: ", i,  $curr.html());
      //       }

      //       course.title = $('.captiontext', $table1).text();
      //       course.crn = crn;

      //       var dateRangeStr = $($values[4]).text();
      //     //console.log(dateRangeStr);

      //     course.type = $($values[0]).text();
      //     var timeStr = $($values[1]).text();
      //     var time = {
      //       start: timeStr.split(' - ')[0],
      //       end: timeStr.split(' - ')[1]
      //     };
      //     course.time = time;
      //     course.days = $($values[2]).text().split('');
      //     course.location = $($values[3]).text();

      //     course.startDate = new Date(dateRangeStr.split(' - ')[0]);
      //     course.endDate = new Date(dateRangeStr.split(' - ')[1]);

      //     course.scheduleType = $($values[5]).text();
      //     course.instructors = $($values[6]).text();

      //   }

        return callback(error, response, courses);
    });
  
  // var form = r.form();
  // var a = [
  //   "term_in",//201510
  //   "sel_subj",//:dummy
  //   "sel_day",//:dummy
  //   "sel_schd",//:dummy
  //   "sel_insm",//:dummy
  //   "sel_camp",//:dummy
  //   "sel_levl",//:dummy
  //   "sel_sess",//:dummy
  //   "sel_instr",//:dummy
  //   "sel_ptrm",//:dummy
  //   "sel_attr",
  //   "sel_subj",
  //   "sel_crse",
  //   "sel_title",
  //   "sel_insm",
  //   "sel_from_cred",
  //   "sel_to_cred",
  //   "sel_levl",
  //   "sel_instr",
  //   "sel_attr",
  //   "begin_hh",
  //   "begin_mi",
  //   "begin_ap",
  //   "end_hh",
  //   "end_mi",
  //   "end_ap"
  //   ];
  // for (var b=0, len=a.length; b<len; b++) {
  //   var c = a[b];
  //   var v = params[c];
  //   console.log(b, c,v);
  //   form.append(c, v);
  // }

  return r;
};
