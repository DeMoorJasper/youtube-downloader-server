// Install fluent-ffmpeg before running this!
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const data = require('./data');
const Promise = require('Promise').default;

const extractVideoID = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        console.log("Could not extract video ID.");
    }
}

const download = (url) => {
    data.makeDir(path.resolve(`./exports`));
    const audioOutput = path.resolve(`${extractVideoID(url)}.mp4`);
    const exportLoc = `./exports/${extractVideoID(url)}.mp3`;
    const mainOutput = path.resolve(exportLoc);

    return new Promise((resolve, reject) => {
        if (data.doesExist(mainOutput)) {
            resolve(exportLoc);
            return;
        }
        ytdl(url, { filter: format => { return format.container === 'mp4' && !format.encoding; } })
            // Write audio to file since ffmpeg supports only one input stream.
            .pipe(fs.createWriteStream(audioOutput))
            .on('finish', () => {
                ffmpeg()
                    .input(ytdl(url, {
                        filter: format => {
                            return format.container === 'mp4' && !format.audioEncoding;
                        }
                    }))
                    .videoCodec('copy')
                    .input(audioOutput)
                    .audioCodec('libmp3lame')
                    .outputFormat('mp3')
                    .save(mainOutput)
                    .on('error', console.error)
                    .on('progress', progress => {
                        /*process.stdout.cursorTo(0);
                        process.stdout.clearLine(1);
                        process.stdout.write(progress.timemark);*/
                    }).on('end', () => {
                        fs.unlink(audioOutput, err => {
                            if (err) console.error(err);
                            else console.log('\nfinished downloading');
                        });
                        resolve(exportLoc);
                    });
            });
        setTimeout(() => resolve(5), 1000)
    })
}

exports.download = download;
exports.extractVideoID = extractVideoID;