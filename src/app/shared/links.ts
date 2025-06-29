import { defineLinks } from "rwsdk/router";

export const link = defineLinks([
  "/",
  "/user/login",
  "/user/logout",
  "/products",
  "/products/:id",
  "/posts",
  "/posts/:id",
]);
