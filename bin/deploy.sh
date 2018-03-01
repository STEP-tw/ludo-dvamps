heroku create $1
if [ $? != 0 ]; then
  echo "app name not available give someother name"
  read appName
  heroku create $appName
  while [ $? != 0 ]; do
    echo "app name not available give someother name"
    read appName
    heroku create $appName
  done
fi
git push heroku master --no-verify
heroku open