const express = require('express')
const app = express();
const path = require('path');

const ytdl = require("./download-youtube");

const port = 3000;

app.get('/', function (req, res) {
    let url = req.query.url;
    if (!url) {
        return res.send("Please provide a url.");
    }

    const file = ytdl.extractVideoID(url) + '.MP3';
    res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment`,
        'filename': file,
        'Access-Control-Allow-Origin': '*'
    });

    ytdl.download(url).then((fulfilled) => {
        console.log("Send converted youtube vid!");
        res.sendFile(path.resolve(`./exports/${file}`));
    }, (rejected) => {
        res.send("Something went wrong.");
    });
})
 
app.listen(port)
console.log(`Server running on localhost:${port}`)