import React from "react";
import { link } from "../shared/links";
import { db } from "@/db";

const SmartBreadcrumbs = async ({ currentUrl }: { currentUrl: string }) => {
  const pathname = new URL(currentUrl).pathname;
  const pathnameParts = pathname.split("/").filter(Boolean);

  // Fetch titles for posts and products in parallel
  const [posts, products] = await Promise.all([
    db.post.findMany({ select: { id: true, title: true } }),
    db.product.findMany({ select: { id: true, title: true } }),
  ]);

  const getTitle = (part: string) => {
    // Check if it's a post
    const post = posts.find((p) => p.id === part);
    if (post) return post.title;

    // Check if it's a product
    const product = products.find((p) => p.id === part);
    if (product) return product.title;

    // Default to capitalized part
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <a href={link("/")}>Home</a> /
      {pathnameParts.map((part, index) => (
        <React.Fragment key={index}>
          <a
            href={`/${pathnameParts.slice(0, index + 1).join("/")}`}
            style={{ textTransform: "capitalize" }}
          >
            {getTitle(part)}
          </a>
          {index < pathnameParts.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export { SmartBreadcrumbs };
