while true
do
  nyc --reporter=html mocha --recursive
  if [ $? -ne 0 ]; then
    break
  fi
done
