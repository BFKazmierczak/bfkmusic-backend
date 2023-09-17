const sanitize = require("@strapi/utils");
const uploadService = require("./services/index");

module.exports = (plugin) => {
  console.log("plugin:", plugin);

  plugin.contentTypes.file.lifecycles = {
    async afterCreate(ctx) {
      console.log("afterCreate lifecycle", ctx);

      const { attributes } = ctx.model;
      const { fileId } = ctx.result;

      try {
        // Calculate the duration
        const duration = await uploadService.calculateDuration(ctx.result);

        console.log("new duration:", duration, "seconds");

        // Update the "duration" field in the uploaded file
        const updatedFile = await strapi
          .query("file")
          .update({ id: fileId }, { duration });

        // ctx.send(sanitize.(updatedFile, { model: strapi.models.file }));
      } catch (err) {
        // Handle errors
        console.error("Error calculating duration:", err);
        // ctx.throw(500, "Error calculating duration");
      }
    },
  };

  return plugin;
};
