const sanitize = require("@strapi/utils");
const uploadService = require("./services/index");

module.exports = (plugin) => {
  plugin.contentTypes.file.lifecycles = {
    async afterCreate(ctx) {
      const file = ctx.result;

      try {
        const duration = await uploadService.calculateDuration(file);

        const fileToUpdate = await strapi.db
          .query("plugin::upload.file")
          .update({ where: { id: file.id }, data: { duration } });

        // ctx.send(sanitize.(updatedFile, { model: strapi.models.file }));
      } catch (err) {
        console.error(err);
        // ctx.throw(500, "Error calculating duration");
      }
    },
  };

  return plugin;
};
