const express = require('express')
const app = express();
const http = require('http').Server(app);
const path = require('path');

const port = process.env.PORT || 8000;

app.use('/node_modules/bootstrap/', express.static(path.join(__dirname + '/node_modules/bootstrap/')));
app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
  console.log('Example app listening on port ' + port);
});