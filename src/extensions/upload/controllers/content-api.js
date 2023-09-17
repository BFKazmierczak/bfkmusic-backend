const { sanitize } = require("@strapi/utils");
const uploadService = require("../services");

module.exports = {
  async upload(ctx) {
    const {
      query: { id },
      request: { files: { files } = {} },
    } = ctx;

    strapi.log("upload ctx:", ctx);
    console.log(ctx);

    // if (_.isEmpty(files) || files.size === 0) {
    //   if (id) {
    //     return this.updateFileInfo(ctx);
    //   }

    //   throw new ValidationError('Files are empty');
    // }

    await (id ? this.replaceFile : this.uploadFiles)(ctx);
  },
};
