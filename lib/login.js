var cheerio = require("cheerio");

module.exports = function(params, callback) {
    var self = this;
    params = params || { };
    var username = params.username;
    var password = params.password;

    var url = self.baseURL + "twbkwbis.P_ValLogin";
    var referer = "twbkwbis.P_WWWLogin";

    // Setup Cookie Session
    var testCookie = "TESTID=set";
    var cookie = self.request.cookie(testCookie);
    self.cookieJar.setCookie(cookie, self.baseURL, function (err, cookie) {

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
            // console.log('Completed request', error, response, body);
            if (error) {
              return callback(error, response, self);
            }
            // Check if login failed
            var successfulRedirectUrl = "/pls/sNLIVE/twbkwbis.P_GenMenu";
            var $ = cheerio.load(body);
            var $el = $('meta[http-equiv="refresh"]');
            if ($el) {
              // Has meta redirect element
              // Check if is redirecting to the successful URL
              var redirectUrl = $el.attr('content');
              if (redirectUrl && redirectUrl.indexOf(successfulRedirectUrl) > -1) {
                // No errors
                // Successful
                return callback(null, response, self);
            }
        }
        error = new Error("Authorization Failure - Invalid User ID or PIN.");
        return callback(error, response, self);
      });
    });
};
