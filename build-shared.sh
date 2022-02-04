#!/bin/bash

TARGET_NAME=""
if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]
then
    echo "Darwin"
    TARGET_NAME="./output/libdiscover.so"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]
then
    TARGET_NAME="./output/discover.dll"
else
    echo "unsupported platform"
    sleep 1
    exit 1
fi

if [[ ! -d "./output" ]]
then
    if [[ ! -L "./output" ]]
    then
        echo "output directory does not exist."
        mkdir "./output"
    fi
fi

go build -o $TARGET_NAME -buildmode=c-shared .
if [ $? -ne 0 ]
then
    echo "compilation failed!"
    sleep 1
    exit 1
fi

npm --prefix "./renderer" run build
if [ $? -ne 0 ]
then
    echo "compilation failed!"
    sleep 1
    exit 1
fi
cp -r "./renderer/dist" "./output"

echo "compilation succeeded!"
sleep 1