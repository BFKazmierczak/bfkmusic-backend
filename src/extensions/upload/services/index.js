const ffmpeg = require("fluent-ffmpeg");

module.exports = {
  calculateDuration: async (file) => {
    strapi.log("passed file:", file);

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(file.path, (err, metadata) => {
        if (err) reject(err);
        else {
          const durationInSeconds = metadata.format.duration;
          resolve(durationInSeconds);
        }
      });
    });
  },
};
