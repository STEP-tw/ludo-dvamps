COUNTER=0
echo ${1}
  while [  $COUNTER -lt ${1} ]; do
    mocha test/integrationTest/appTest1.js
    mocha test/integrationTest/appTest2.js
    let COUNTER=COUNTER+1
 done
