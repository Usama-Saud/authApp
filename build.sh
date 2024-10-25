#!/bin/bash

# Get version and build number from package.json
sh ./get-version.sh

# Check if 'uat' is passed as an argument
if [ "$1" == "uat" ]; then

    # Remove existing build directory for UAT
    rm -rf $PWD/build/uat/*

    # Clean the build
    xcodebuild clean -workspace myApp.xcworkspace -scheme MyAppUAT -configuration ReleaseStaging

    # Build the project
    xcodebuild build -workspace myApp.xcworkspace -scheme MyAppUAT -configuration ReleaseStaging -sdk iphoneos

    # Archive the build
    xcodebuild archive -workspace myApp.xcworkspace -scheme MyAppUAT -configuration ReleaseStaging -sdk iphoneos -archivePath "$PWD/build/staging/MyAppUAT.xcarchive"

    # Export the archive and create the .ipa file
    xcodebuild -exportArchive -archivePath "$PWD/build/staging/MyAppUAT.xcarchive" -exportPath "$PWD/build/staging/MyAppUAT" -exportOptionsPlist "ExportOptions.plist"
fi
