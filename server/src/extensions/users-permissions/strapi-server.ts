export default (plugin) => {
  const originalDestroy = plugin.controllers.user.destroy;

  plugin.controllers.user.destroy = async (ctx) => {
    const { id } = ctx.params;

    if (!ctx.state.user || ctx.state.user.role.name !== "Admin") {
      return ctx.forbidden("Unauthorized");
    }

    try {
      // await strapi.db.connection.raw(
      //   `DELETE FROM "public"."posts"
      //    USING "public"."posts_author_lnk" AS "t1", "public"."up_users" AS "t2"
      //    WHERE "t2"."id" = ? AND "posts"."id" = "t1"."post_id" AND "t1"."user_id" = "t2"."id"`,
      //   [id],
      // );

      const posts = await strapi.query("api::post.post").findMany({
        where: { author: id },
        select: ["id"],
      });
      const postIds = posts.map((post) => post.id);

      await strapi.query("api::post.post").deleteMany({
        where: { id: { $in: postIds } },
      });

      await originalDestroy(ctx);

      //   return ctx.send({
      //     message: "User and related posts deleted successfully",
      //   });
    } catch (error) {
      console.error("Error:", error);
      return ctx.badRequest("Failed to delete", { error });
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "DELETE",
    path: "/users/:id",
    handler: "user.destroy",
  });

  return plugin;
};
