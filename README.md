# Push notification tester

## Description

This repository contains nodeJS scripts to test push notification setups under IOS and Android.

Ensuring that the native push notifications on each platform work before adding to OneSignal, Pushwoosh, AWS SNS or other platforms on top of it is essential

For Android only the legacy method is working at the moment.

The IOS script requires a third party library to operate, to install and run type:

```
npm install
node send_ios_push.js
```

For Android you can simply type:
```
node send_android_push_legacy.js
```

## IOS

After merging the push certificate request into your computer then exporting to a .p12 certificate file from the keychain, you will need to convert it to use with the script.  The instruction to convert the certificate is in the top of the script file.

## TODO

* Complete Android script to send using FCM (Firebase Cloud Messaging)
* Remove dependency of third party library for IOS
