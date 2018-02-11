/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
const express = require('express');
const kraken = require('kraken-js');
var bodyParser = require('body-parser');


const app = express();
app.use(express.static('src'))
app.use(express.static('dist'))
app.use(kraken());

app.get('/', function(req, res){
   res.sendFile(__dirname + '/src/views/index.html');
});

app.get('/sample', function(req, res) {
   res.sendFile(__dirname + '/src/views/Sample.html');
});

app.get('/temp', function(req, res) {
    res.sendFile(__dirname + '/src/views/simulation.html');
});

app.get('/temp', function(req, res) {
    res.sendFile(__dirname + '/src/data/salary_gender.json');
});

// Start the server
const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

var docs = '{"documents":[]}';
var count = 0;
var prev_data;
const socketio = require('socket.io')(server);

const sentimentAnalyzer = require("./sentimentAnalyzer.js");
console.log(sentimentAnalyzer);

socketio.on('connection', function (socket) {

  socket.on('data_received', function(data) {
      let display_text = JSON.parse(data).DisplayText;
      if (prev_data === null || prev_data !== display_text) {
          var jsonObj = JSON.parse(docs);
          jsonObj["documents"].push({'id': count.toString(), 'language': 'en', 'text': display_text});
          count++;
          console.log('Json obj pushed: ' + jsonObj);
          docs = JSON.stringify(jsonObj);
          let x = sentimentAnalyzer.get_sentiments(JSON.parse(docs));

      }

  });
});

function emitAvg() {
    socketio.emit('avg_received', prev_avg);
}
var prev_avg = 0;
function updateAvg() {
    if (prev_avg != sentimentAnalyzer.avg) {
        prev_avg = sentimentAnalyzer.avg;
        emitAvg();
    }
}

var checkAvgInterval = setInterval(updateAvg, 5000)


// [END app]
