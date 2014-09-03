var cheerio = require("cheerio");

module.exports = function(params, callback) {
  var self = this;
  params = params || { };
  function d(name, v) {
    params[name] = params[name] || v;
  }
  d('p_calling_proc', 'bwckschd.p_disp_dyn_sched');
  d('p_term', 'dummy');
  d('p_by_date', 'Y');
  d('p_from_date', '');
  d('p_to_date', '');

  // // Generate Form Data string for request
  var dataStr = "p_calling_proc="+params.p_calling_proc+"&"+
                  "p_term="+params.p_term+"&"+
                  "p_by_date="+params.p_by_date+"&"+
                  "p_from_date="+params.p_from_date+"&"+
                  "p_to_date="+params.p_to_date;
  // console.log(dataStr);

  var referer = "bwckschd.p_disp_dyn_sched";
  var url = "bwckgens.p_proc_term_date";

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
      // console.log('Done loading.');
      // 
      var subjects = [];
      // Parse DOM into terms
      var $ta = $('.pagebodydiv>form>table.dataentrytable');
      var $s = $('select[name="sel_subj"]', $ta);
      var $options = $('option', $s);
      for (var i=0, len=$options.length; i<len; i++)
      {
        var $t = $($options[i]);
        var val = $t.attr('value');
        var title = $t.text().trim();
        // Exclude those without a value
        if (!val) {
          // console.log('Excluding: ', title);
        } else {
          subjects.push({
            title: title,
            value: val
          });
        }
      }
      return callback(error, response, subjects);
    });

  return r;
};
