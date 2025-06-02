import { defineApp, ErrorResponse } from "rwsdk/worker";
import { route, render, prefix, layout, index } from "rwsdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { type User, db, setupDb } from "@/db";
import { env } from "cloudflare:workers";
import { Layout } from "./app/pages/Layout";
import { ProductList } from "./app/pages/products/ProductList";
import { IndividualProduct } from "./app/pages/products/IndividualProduct";
import { PostList } from "./app/pages/posts/PostList";
import { IndividualPost } from "./app/pages/posts/IndividualPost";
export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  render(Document, [
    layout(Layout, [
      index(Home),
      route("/products", ProductList),
      route("/products/:id", IndividualProduct),
      route("/posts", PostList),
      route("/posts/:id", IndividualPost),
    ]),
    prefix("/user", userRoutes),
  ]),
]);
