#!/bin/bash

VERSION="$(node -pe 'JSON.parse(process.argv[1]).version' "$(cat ./package.json)")"
BUILD_NUMBER="$(node -pe 'JSON.parse(process.argv[1]).versionCode' "$(cat ./package.json)")"

xcrun agvtool new-marketing-version $VERSION
xcrun agvtool new-version -all $BUILD_NUMBER
