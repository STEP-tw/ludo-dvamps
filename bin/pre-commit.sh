eslint .
if [ $? == 1 ]; then
  exit 1
fi
mocha --recursive
if [ $? == 1 ]; then
  exit 1
fi
nyc check-coverage --functions 85 --branches 90
