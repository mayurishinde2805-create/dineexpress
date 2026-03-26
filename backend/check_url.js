const https = require('https');

const url = 'https://dineexpress.onrender.com/images/veg-spring-rolls.png';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('CORS Header:', res.headers['access-control-allow-origin']);
  console.log('Full Headers:', JSON.stringify(res.headers, null, 2));
  process.exit();
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit();
});
