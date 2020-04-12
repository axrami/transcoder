var request = require('request');
var fs = require('fs');

var reqUpload = request.post("http://localhost:3000/api/audio?from=amr&to=mp4", (error, res) => {
    const body = JSON.parse(res.body);
    if (error) {
        console.log("received error: " + error);
    } else {
        console.log("received response: " + res.body);
    }
});
var upload = fs.createReadStream('../files/test-audio.amr', { highWaterMark: 500 });

upload.pipe(reqUpload);

var upload_progress = 0;
upload.on("data", function (chunk) {
    upload_progress += chunk.length;
    console.log(new Date(), upload_progress);
});

upload.on("end", function () {
    console.log('Finished upload');
});

request
    .get("http://localhost:3000/api/audio/d9f5c939-e6e2-4291-88c0-8edf25059052?extension=mp4")
    .on("response", response => {
        console.log("response: " + response)
    })
    .on("error", error => {
        console.log("error : " + error)
    })
    .pipe(fs.createWriteStream('./files/downloaded.mp4'));
