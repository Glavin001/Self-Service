// Dependencies
var assert = require("assert")
var selfService = require("../lib/");
var creds;
try {
    creds = require('../credentials.json');
} catch (e) {
    console.log(e);
    console.log("Please create a file `credentials.json` in the project root directory.");
    console.log("{ 'username': 'A12345', 'password': 'password' }");
    process.exit(1);
}

var s = new selfService;

// Run tests
describe('User', function() {
  describe('#Login()', function(){
    
    it('should login without error', function(done){
      
        s.login({'username': creds.username, 'password': creds.password }, function(error, response, localService) {
            //console.log("Completed!");
            //console.log(error, response, body);
            //console.log(error);

            done();

            describe('#weekAtAGlance()', function() {
                it('should get Week at a Glance without error', function(done){

                    localService.weekAtAGlance({ /*'startDate': new Date()*/ }, function(error, response, courses) {
                        console.log("Completed!", courses);
                        done();
                    });
                });
            });

        });

    })

  })
})