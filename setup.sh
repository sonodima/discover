go get .
if [ $? -ne 0 ]
then
    echo "unable to obtain Go dependencies!"
    sleep 1
    exit 1
fi

cd renderer
npm install
if [ $? -ne 0 ]
then
    echo "unable to install npm dependencies!"
    sleep 1
    exit 1
fi

echo "dependencies refreshed!"
sleep 1