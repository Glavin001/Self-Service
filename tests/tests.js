// Dependencies
var assert = require("assert");
var selfService = require("../lib/");
var creds;
try {
    creds = require('../credentials.json');
} catch (e) {
    console.log(e);
    console.log(
        "Please create a file `credentials.json` in the project root directory."
    );
    console.log("{ 'username': 'A12345', 'password': 'password' }");
    process.exit(1);
}

// Run tests
describe('User', function() {
    
    describe('#Login()', function() {

        it('should login with error', function(done) {
            var s = new selfService();

            s.login({
                'username': "A123456789",
                'password': "password"
            }, function(error, response, localService) {
                // console.log("Completed!", error);
                // console.log(response,
                //     localService);

                if (error) {
                    done();
                } else {
                    throw new Error(
                        "Expected an error for invalid login credentials."
                    );
                }
            });
        });

        it('should login without error', function(done) {
            var s = new selfService();

            s.login({
                'username': creds.username,
                'password': creds.password
            }, function(error, response, localService) {
                //console.log("Completed!");
                //console.log(error,  response.statusCode, localService);
                //console.log(error);

                if (!error) {
                    done();
                } else {
                    throw error;
                }

                describe('#weekAtAGlance()', function() {
                    it(
                        'should get Week at a Glance without error',
                        function(done) {

                            this.timeout(10000);

                            localService.weekAtAGlance({
                                'startDate': new Date()
                            }, function(error, response,
                                courses) {

                                // console.log(
                                //     "Completed!",
                                //     courses);

                                if (!error) {
                                    done();
                                } else {
                                    throw error;
                                }
                            });
                        });
                });

                /*
            describe("#course()", function() {
                it('should get a Course without error', function(done) {
                    this.timeout(5000);

                    localService.getCourse({
                        'term_in': 201420,
                        'crn': 21822
                    }, function(error, response, course) {
                        console.log(error, course);
                        done();
                    });

                });
            });
            */

            });
        });
    });

  describe("#Unsecured API", function() {

    it('should list all terms', function(done) {
        this.timeout(10000);
        var s = new selfService();
        s.getTerms(function(error, response, terms) {
          done();
        });
    });

    it('should list all subjects for term (201510)', function(done) {
        this.timeout(10000);
        var s = new selfService();
        s.getSubjects({
          p_term: 201510
        }, function(error, response, subjects) {
          // console.log(subjects);
          done();
        });
    });

    it('should list all courses for subject Accounting (ACCT)', function(done) {
        this.timeout(10000);
        var s = new selfService();
        s.getCoursesSchedule({
          'term_in': 201510,
          'sel_subj': 'ACCT'
        }, function(error, response, courses) {
          // console.log(error, response.body);
          // console.log(error, courses);
          done();
        });
    });

  });

})
