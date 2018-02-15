eslint .
if [ $? == 1 ]; then
  exit 1
fi
mocha --recursive
if [ $? == 1 ]; then
  exit 1
fi
nyc check-coverage
if [ $? == 1 ]; then
  exit 1
fi
