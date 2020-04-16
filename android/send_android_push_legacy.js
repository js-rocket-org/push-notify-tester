/*
  This script has been tested to be working on 2019-12-19
  However, this API may be deprecates, fix up the new fcm v1 script which is more complicated:
  https://medium.com/@ThatJenPerson/authenticating-firebase-cloud-messaging-http-v1-api-requests-e9af3e0827b8
*/

const https = require('https');
const http = require('http');
const url = require('url');

const PUSH_URL = 'https://fcm.googleapis.com/fcm/send';

// Settings -> Cloud Messaging -> Server key

// Obtain settings from firebase console under
// Settings -> Cloud Messaging -> Server key
// EXAMPLE: AAAAXwfd86k:APA9EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE-EXAMPLE1

const SERVER_KEY =
  'AAAAXwfd86k:APA91bHRmszjLQulrZCn6-Bhs_NCp5-VhgG4sZZidNU44WpIA2guXlW4s_NC9iJXr4-7HzNSS0U_MdWLTmZq6PVmQx5PKLeSi9nds0RobmaDxDIMRIyk9iM4pot2iipWTXGlU79DuBIP';

const DEVICE_TOKEN =
  'e3mFrcf_3-o:APA91bExQWWVBAVJY5-_2POmqQELxlbRZZqJoEEv2iEGS3dOPeKjljOpNBJz3rph_XJl94L2CAfzsQFg5claMsNxo1FY5qXXXiCaODNaUsvyFuuaxLJMqsrucHoc0ypiWzWu8_YdbtwU';

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

const SendMessage = async (title, body) => {
  const headers = { 'Content-Type': 'application/json', Authorization: `key=${SERVER_KEY}` };
  const options = { method: 'POST', headers };
  const body_content = JSON.stringify({
    to: DEVICE_TOKEN,
    content_available: true,
    priority: 'high',
    notification: { title, body },
    data: { some: 'data. This can be anything' },
  });

  const result = await HttpRequest(PUSH_URL, options, body_content).catch(e => {
    console.log(e);
  });

  console.log('Push result: ', result);
};

SendMessage(`test push  at ${new Date()}`, 'Hello, This is notification test from FCM using legacy API');
