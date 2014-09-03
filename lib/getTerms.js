var cheerio = require("cheerio");

module.exports = function(callback) {
  var self = this;

  var referer = "twbkwbis.P_GenMenu?name=homepage";
  var url = "bwckschd.p_disp_dyn_sched";

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
      // console.log('\n=== Done Request ===', error, body);
      var $ = cheerio.load(body);
      // console.log('Done loading.');
      var terms = [];
      // Parse DOM into terms
      var $ta = $('.pagebodydiv>form>table.dataentrytable');
      var $s = $('select[name="p_term"]', $ta);
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
          terms.push({
            title: title,
            value: val
          });
        }
      }
      return callback(error, response, terms);
    });
};
