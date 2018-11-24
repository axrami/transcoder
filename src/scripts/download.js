var request = require("reqeust");
var fs = require('fs');

// /Users/aramirez/Development/transcoder/files/d2911ab2-844a-4684-b633-3619d4915b31.mp3

var path = '/Users/aramirez/Development/transcoder/files';

var fileid = "d2911ab2-844a-4684-b633-3619d4915b31";

// var r = request.get("https://andrewr.ngrok.io/api/audio/" + fileid + "?extension=mp3", function(error, response) {
//     console.log("error:" + error);
//     response.pipe(file);
// })

request("https://andrewr.ngrok.io/api/audio/" + fileid + "?extension=mp3").pipe(fs.createWriteStream(path + "/" + "downloadFile.mp3"))