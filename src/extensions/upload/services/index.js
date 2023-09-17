const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");

module.exports = {
  calculateDuration: async (file) => {
    console.log("file:", file.url);

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(`./public${file.url}`, (err, metadata) => {
        if (err) reject(err);
        else {
          const durationInSeconds = metadata.format.duration;
          resolve(durationInSeconds);
        }
      });
    });
  },
};
