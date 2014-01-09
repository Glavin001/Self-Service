#!/bin/bash
#Attempts to log into SMU Self-Service Banner
#cURL HTTP Scripting Tutorial http://curl.haxx.se/docs/httpscripting.html
#
#SESSID is stored in cookies and tells the server what session to use
#You need to log in with a valid A# and password to get a SESSID
#The SESSID is 16 characters. The first 8 change with each new page.

#Name user inputs
Anum=$1
pass=$2
output=smulogin.html

  echo "WARNING: PASSWORDS SAVED IN HISTORY IN PLAINTEXT"
  echo "WARNING: APPLICATION IS NOT SECURE. USE AT OWN RISK!"
  read -p "Are you sure you want to continue? [Enter] yes, Ctrl+C to cancel..."


#SMU URLS
SMU=https://ssb-nlive.smu.ca/pls/sNLIVE/
referer=twbkwbis.P_WWWLogin
target=twbkwbis.P_ValLogin

#Big --cookie block copied from Chrome, likely not needed
#The --cookie-jar is needed to write new cookies to a file
#User-agent is Chrome on Macbook (otherwise it would be 'cURL 7')

  curl -v --cookie "TESTID=set; optimizelyEndUserId=oeu1384130143695r0.4195049670524895; optimizelySegments=%7B%22204658328%22%3A%22false%22%2C%22204728159%22%3A%22none%22%2C%22204736122%22%3A%22referral%22%2C%22204775011%22%3A%22gc%22%7D; optimizelyBuckets=%7B%22346460619%22%3A%220%22%7D; s_fid=3CE7372DD73017B8-1165F3835018080C; s_lv=1384130197896; _ga=GA1.2.905276058.1380075868; __utma=151355750.905276058.1380075868.1388760281.1389221031.13; __utmc=151355750; __utmz=151355750.1387380695.9.6.utmcsr=cs.smu.ca|utmccn=(referral)|utmcmd=referral|utmcct=/; accessibility=false" \
--cookie-jar newcookies.txt \
--user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36" \
--referer "$SMU$referer" --data-urlencode "sid=$1&PIN=$2" "$SMU$target" >> $output 

echo "Program completed. Output saved to $output"
