"use strict";

/**
 * comment router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::comment.comment", {
  config: {
    find: {
      policies: ["api::comment.my-comments"],
    },
  },
});
