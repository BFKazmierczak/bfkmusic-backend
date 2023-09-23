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

    const { toEntityResponse, toEntityResponseCollection } = strapi.service(
      "plugin::graphql.format"
    ).returnTypes;

    const { transformArgs } = strapi
      .plugin("graphql")
      .service("builders").utils;

    // const { formatGraphqlError } = strapi.plugin("graphql").formatGraphqlError;

    extensionService.use(({ strapi }) => ({
      typeDefs: `
        type Query {
          comments: CommentEntityResponseCollection
        }

        type Mutation {
          createComment(data: CustomCommentInput!): CommentEntityResponse
        }

        input CustomCommentInput {
          songId: Int!
          fileId: Int!
          timeRange: TimeRange!
          content: String!
        }

        input TimeRange {
          from: Int!
          to: Int!
        }
      `,
      resolvers: {
        Mutation: {
          createComment: {
            resolve: async (parent, args, context) => {
              const { id: userId } = context.state.user;

              const song = await strapi.entityService.findOne(
                "api::song.song",
                args.data.songId,
                {
                  populate: ["users", "audio"],
                }
              );

              if (!song) {
                throw new Error("There is no song with given ID.");
              }

              if (!song.users.some((user) => user.id === userId)) {
                throw new Error(
                  "You have no permissions to comment on this song."
                );
              }

              if (!song.audio.some((audio) => audio.id === args.data.fileId)) {
                throw new Error("No such audio file exists within this song.");
              }

              const timeFrom = args.data.timeRange.from;
              const timeTo = args.data.timeRange.to;
              const timeRange = `${timeFrom}:${timeTo}`;

              const newComment = await strapi.entityService.create(
                "api::comment.comment",
                {
                  data: {
                    ...args.data,
                    user: userId,
                    timeRange,
                    publishedAt: new Date(),
                  },
                }
              );

              const response = toEntityResponse(newComment, {
                resourceUID: "api::comment.comment",
              });

              return response;
            },
          },
        },
        Query: {
          comments: {
            resolve: async (parent, args, context) => {
              const transformedArgs = transformArgs(args, {
                contentType: strapi.contentTypes["api::comment.comment"],
                usePagination: true,
              });

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
