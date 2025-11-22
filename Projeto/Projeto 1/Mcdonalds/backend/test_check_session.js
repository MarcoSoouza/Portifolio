const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/check-session',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let responseBody = '';
  console.log('Status Code:', res.statusCode);

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', responseBody);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
