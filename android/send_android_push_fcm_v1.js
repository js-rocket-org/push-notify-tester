/*
DOES NOT WORK YET
Complete this:
https://medium.com/@ThatJenPerson/authenticating-firebase-cloud-messaging-http-v1-api-requests-e9af3e0827b8
*/

const https = require('https');
const http = require('http');
const url = require('url');

const PROJECT_ID = 'from-firebase-project';
const PUSH_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

// Obtain settings from firebase console under
// Settings -> General -> web API key AIzaSyD9BFhMtrnYnfUlJ5vLqUkctSgxZqj2aI8
// Settings -> Cloud Messaging -> Server key = AAAAXwfd86k:APA91bHRmszjLQulrZCn6-Bhs_NCp5-VhgG4sZZidNU44WpIA2guXlW4s_NC9iJXr4-7HzNSS0U_MdWLTmZq6PVmQx5PKLeSi9nds0RobmaDxDIMRIyk9iM4pot2iipWTXGlU79DuBIP

const SERVER_KEY =
  'AAAAXwfd86k:APA91bHRmszjLQulrZCn6-Bhs_NCp5-VhgG4sZZidNU44WpIA2guXlW4s_NC9iJXr4-7HzNSS0U_MdWLTmZq6PVmQx5PKLeSi9nds0RobmaDxDIMRIyk9iM4pot2iipWTXGlU79DuBIP';

const DEVICE_TOKEN =
  'e3mFrcf_3-o:APA91bExQWWVBAVJY5-_2POmqQELxlbRZZqJoEEv2iEGS3dOPeKjljOpNBJz3rph_XJl94L2CAfzsQFg5claMsNxo1FY5qTPJiCaODNaUsvyFuuaxLJMqsrucHoc0ypiWzWu8_YdbtwU';

const HttpRequest = (fullurl, options, body) =>
  new Promise((resolve, reject) => {
    const urlObject = url.parse(fullurl);
    const allOptions = Object.assign(options, {
      hostname: urlObject.hostname,
      path: urlObject.path,
      port: urlObject.port,
    });

    const request = fullurl.toUpperCase().indexOf('HTTPS') === 0 ? https.request : http.request;

    const req = request(allOptions, res => {
      let result = '';
      res.setEncoding('utf8');
      res.on('data', chunk => (result += chunk));
      res.on('end', () => {
        resolve(result);
      });
    });

    req.on('error', err => reject(err));
    if (body) req.write(body);
    req.end();
  });

const SendMessage = async () => {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVER_KEY}` };
  const options = { method: 'POST', headers };
  const body = JSON.stringify({
    message: {
      token: DEVICE_TOKEN,
      notification: {
        title: `Test FCM Message ${new Date()}`,
        body: 'This is a message from FCM',
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          body: 'This is a message from FCM to web',
          requireInteraction: 'false',
          // badge: '/badge-icon.png',
        },
      },
    },
  });

  const result = await HttpRequest(PUSH_URL, options, body).catch(e => {
    console.log(e);
  });

  console.log('Push result: ', result);
};

SendMessage();
