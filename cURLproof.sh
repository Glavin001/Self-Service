#!/bin/bash
#Accesses SMUs Selfive-Service Banner using curl
#cURL HTTP Scripting Tutorial http://curl.haxx.se/docs/httpscripting.html
#
#SESSID is stored in cookies and tells the server what session to use
#You need to log in with a valid A# and password to get a SESSID
#The SESSID is 16 characters. The first 8 change with each new page.

#Script takes two inputs: The SESSID, and the file to write to.
SESSID=$1
output=$2

#SMU URLS
SMU=https://ssb-nlive.smu.ca/pls/sNLIVE/
#bwskfcls.p_sel_crse_search
#bwckgens.p_proc_term_date

#Output options to user
echo "1 - Week at a glance"
echo "2 - Detailed Schedule"
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

fi

echo "Program completed. Output saved to $2"
