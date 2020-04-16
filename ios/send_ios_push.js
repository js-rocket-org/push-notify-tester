/*
source: https://eladnava.com/send-push-notifications-to-ios-devices-using-xcode-8-and-swift-3/
*/

/* 
converting .p12 certificates exported from keychain
openssl pkcs12  -clcerts -nokeys -in push-cert.p12 -out apns-cert.pem
openssl pkcs12 -nocerts -in push-private-key.p12 -out apns-key.pem
# remove password from previous step
openssl rsa -in apns-key.pem -out apns-key-noenc.pem
*/

var apn = require('apn');

// Set up apn with the APNs certificates
var apnProvider = new apn.Provider({
  cert: 'apns-cert.pem',
  key: 'apns-key-noenc.pem',
  production: false, // Set to true if sending a notification to a production iOS app
});

// Enter the device token from the Xcode console
// EXAMPLE: c58a6896acbe2c44dd2b6a539830d7e01fba5a563131fb01ffe7909245495d66
var deviceToken = 'c58a6896acbe2c44dd2b6a539830d7e01fba5a563131fb01ffe7909245495d66';

// Prepare a new notification
var notification = new apn.Notification();
notification.topic = 'com.example.yourapp.bundleid'; // App bundleID

// Set expiration to 1 hour from now (in case device is offline)
notification.expiry = Math.floor(Date.now() / 1000) + 3600;
// Set app badge indicator
notification.badge = 3;
// Play ping.aiff sound when the notification is received
notification.sound = 'ping.aiff';
// Display the following message (the actual notification text, supports emoji)
notification.alert = 'Hello World \u270C';
// Send any extra payload data with the notification which will be accessible to your app in didReceiveRemoteNotification
notification.payload = { id: 123 };

// Actually send the notification
apnProvider.send(notification, deviceToken).then(function(result) {
  // Check the result for any failed devices
  console.log(result);
  process.exit(0);
});
