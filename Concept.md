Self-Service.js
===============

Node.js API for Saint Mary's University Self-Service


## Proof of Concept
Using `curl`.

- Cookies: http://joelpm.com/curl/tools/2010/06/17/curl-with-cookies-and-headers.html
- Referer: http://www.cyberciti.biz/faq/linux-unix-appleosx-bsd-curl-command-httpreferer/
- cURL tutorial: http://curl.haxx.se/docs/httpscripting.html

### Step 1. Login
Login to [selfservice.smu.ca](https://ssb-nlive.smu.ca/pls/sNLIVE/twbkwbis.P_GenMenu?name=homepage).

### Step 2. Retrieving your `SESSID`.
Open up your Web Inspector and look for `SESSID`.

### Step 3. Retrieving your **Week at a Glance**

```
SESSID={Enter your SESSID from Step 2}
curl -v --cookie "SESSID=$SESSID" --referer "https://ssb-nlive.smu.ca/pls/sNLIVE/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu"  "https://ssb-nlive.smu.ca/pls/sNLIVE/bwskfshd.P_CrseSchd" >> smu_user_week_at_a_glance_schedule.html
```

### cURLproof.sh
Get Week at a Glance, and Detailed Schedule using cURL with SESSID.

```
./cURLproof.sh SEhTRDIwMvAybTc2 output.html
1 - Week at a glance
2 - Detailed Schedule
3 - Lookup up Classes [Experimental]
```
