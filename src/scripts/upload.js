var request = require("reqeust");
var fs = require('fs');

var path = '/Users/aramirez/Development/transcoder/files/test-audio.amr';

var r = request.post("http://localhost:3000/api/audio", function(error, res) {
  console.log(JSON.parse(res.body));
});
var upload = fs.createReadStream(path, { highWaterMark: 500 });

upload.pipe(r);
var upload_progress = 0;
upload.on("data", function (chunk) {
  upload_progress += chunk.length;
  console.log(new Date(), upload_progress);
});

upload.on("end", function (res) {
  console.log(res);
});

upload.on("finish", function(data) {
  console.log(data);
})