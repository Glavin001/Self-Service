#!/bin/bash
#Accesses SMUs Selfive-Service Banner using curl
#cURL HTTP Scripting Tutorial http://curl.haxx.se/docs/httpscripting.html
#
#SESSID is stored in cookies and tells the server what session to use
#You need to log in with a valid A# and password to get a SESSID
#The SESSID is 16 characters. The first 8 change with each new page.

#Name user inputs
SESSID=$1
output=$2

#Error checking
if [ $# != 2 ]; then
  echo "This script automates some simple tasks on SMU Self-Service Banner using cURL"
  echo "It take two parameters as input:"
  echo "The session id stored in cookies, and the desired output filename."
  echo ""
  echo "Correct usage: $0 SEhTRDIwMvAybTc2 output.html"
  echo "(Get session id by logging in using browser and checking cookies)"
  echo "Then select from one of the prompted options."
  exit 1;
fi
if [ -f $output ]; then
  echo "File $output already exists"
  read -p "Are you sure you want to continue? [Enter] yes, Ctrl+C to cancel..."
fi


#SMU URLS
SMU=https://ssb-nlive.smu.ca/pls/sNLIVE/
#bwskfcls.p_sel_crse_search
#bwckgens.p_proc_term_date

#Output options to user
echo "1 - Week at a glance"
echo "2 - Detailed Schedule"
echo "3 - Lookup up Classes [Experimental]"
read option


if [ $option -eq 1 ]
then
#Week at a glance
  referer=twbkwbis.P_GenMenu?name=bmenu.P_RegMnu
  target=bwskfshd.P_CrseSchd
  curl -v --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36" --cookie "SESSID=$SESSID" --referer "$SMU$referer"  "$SMU$target" >> $output 

elif [ $option -eq 2 ]
then
#Detailed Schedule
  referer=twbkwbis.P_GenMenu?name=bmenu.P_RegMnu
  target=bwskfshd.P_CrseSchdDetl
  curl -v --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36" --cookie "SESSID=$SESSID" --referer "$SMU$referer" --data-urlencode "term_in=201420" "$SMU$target" >> $output 

elif [ $option -eq 3 ]
then
#Lookup POST
  referer=bwskfcls.p_sel_crse_search
  target=bwckgens.p_proc_term_date

  curl -v \
-H "Connection: keep-alive" \
-H "Content-Length: 77" \
-H "Cache-Control: max-age=0" \
-H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" \
--user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36" \
--referer "$SMU$referer" \
-H "Accept-Encoding: gzip,deflate,sdch" \
-H "Accept-Language: en-US,en;q=0.8,en-GB;q=0.6" \
--cookie "TESTID=set; SESSID=$SESSID; optimizelyEndUserId=oeu1384130143695r0.4195049670524895; optimizelySegments=%7B%22204658328%22%3A%22false%22%2C%22204728159%22%3A%22none%22%2C%22204736122%22%3A%22referral%22%2C%22204775011%22%3A%22gc%22%7D; optimizelyBuckets=%7B%22346460619%22%3A%220%22%7D; s_fid=3CE7372DD73017B8-1165F3835018080C; s_lv=1384130197896; _ga=GA1.2.905276058.1380075868; __utma=151355750.905276058.1380075868.1388760281.1389221031.13; __utmc=151355750; __utmz=151355750.1387380695.9.6.utmcsr=cs.smu.ca|utmccn=(referral)|utmcmd=referral|utmcct=/; accessibility=false" \
--data-urlencode "p_calling_proc=P_CrseSearch&p_term=201420&p_by_date=Y&p_from_date=&p_to_date=" \
--cookie-jar cookies.txt \
 "$SMU$target" >> $output 

fi

echo "Program completed. Output saved to $2"
