[Self-Service.js](https://github.com/SMU-CS-and-Math-Society/Self-Service)
===============

> Node.js API for Saint Mary's University Self-Service.

-----

## Installation

```bash
npm install self-service-banner --save
```

## Usage

```javascript
//
var selfService = require("self-service-banner");

// Login Credentials for Authentication
var creds = {
   "username": "A-Number",
   "password": "123567890"
};

// Create your connection instance.
var s = new selfService;

// Authenticate your connection by logging in with your credentials.
s.login({"username": creds.username, "password": creds.password }, function(error, response, localService) {
    if (!error) {
      // Successful
      localService.weekAtAGlance({ /*'startDate': new Date()*/ }, function(error, response, courses) {
          if (!error) {
              // Successful
              console.log("Completed!", courses);
          } else {
              // An error occured
              throw error;
          }
      });

    } else {
        // An Error occured.
        throw error;
    }

});


```

-----

## For Contributors

1) Use Git to clone this repository.

2) Download all of your dependencies.

```bash
npm install
```

3) Create your credentials file: `./credentials.json`

```json
{
    "username": "A-Number",
    "password": "password"
}
```

4) Test your credentials by running the built-in Unit Tests.

```bash
npm test
```
