"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.service("plugin::graphql.extension");
    extensionService.use(({ strapi }) => ({
      typeDefs: `
        type Query {
          comments: CommentEntityResponseCollection
        }
      `,
      resolvers: {
        Query: {
          comments: {
            resolve: async (parent, args, context) => {
              const { transformArgs } = strapi
                .plugin("graphql")
                .service("builders").utils;

              const transformedArgs = transformArgs(args, {
                contentType: strapi.contentTypes["api::comment.comment"],
                usePagination: true,
              });

              const { toEntityResponseCollection } = strapi.service(
                "plugin::graphql.format"
              ).returnTypes;

              const userId = context.state.user.id;

              transformedArgs.filters = {
                ...transformedArgs.filters,
                user: {
                  id: { $eq: userId },
                },
              };

              const data = await strapi.entityService.findMany(
                "api::comment.comment",
                {
                  ...transformedArgs,
                  populate: "user",
                }
              );

              const response = toEntityResponseCollection(data, {
                args,
                resourceUID: "api::comment.comment",
              });

              return response;
            },
          },
        },
      },
    }));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {},
};
