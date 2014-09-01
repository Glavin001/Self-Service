module.exports = {
    
    // Source: http://stackoverflow.com/a/8486188/2578205
    getJsonFromUrl: function (url) {
      var query = url.split('?')[1];
      var data = query.split("&");
      var result = {};
      for(var i=0; i<data.length; i++) {
        var item = data[i].split("=");
        result[item[0]] = item[1];
      }
      return result;
    }

};