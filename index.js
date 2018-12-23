const express = require('express')
const app = express();
const http = require('http').Server(app);
const path = require('path');
const oi = require('socket.io')(http);
const ClientOAuth2 = require('client-oauth2');

let CONFIG;
if (process.env.CLIENT_ID !== undefined){
  CONFIG = {
	  CLIENT_SECRET: process.env.CLIENT_SECRET,
	  CLIENT_ID: process.env.CLIENT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI
  }
} 
else {
  const localConfig = require('./config');
  CONFIG = localConfig.CONFIG;
};

const port = process.env.PORT || 8000;

app.use('/node_modules/bootstrap/', express.static(path.join(__dirname + '/node_modules/bootstrap/')));
app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let streamlabsAuth;

app.get('/ping', (req, res) => {
  res.status(200).json({"info":"PONG"});
})

app.get('/login', (req, res) => {
  streamlabsAuth = new ClientOAuth2({
    clientId: CONFIG.CLIENT_ID,
    clientSecret: CONFIG.CLIENT_SECRET,
    redirectUri: CONFIG.REDIRECT_URI,
    authorizationUri: 'https://streamlabs.com/api/v1.0/authorize',
    accessTokenUri: 'https://streamlabs.com/api/v1.0/token',
    scopes: ['socket.token']
  })
  res.redirect(streamlabsAuth.redirectUri)
})

http.listen(port, () => {
  console.log('Example app listening on port ' + port);
});