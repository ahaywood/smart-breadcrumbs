import React from "react";
import { link } from "../shared/links";
import { db } from "@/db";

// Simple overrides - only when you need them
const overrides: Record<string, string> = {
  "/posts/1": "Overriding the Title",
  "/products/2": "Another Override",
};

const Breadcrumbs = async ({ currentUrl }: { currentUrl: string }) => {
  const pathname = new URL(currentUrl).pathname;
  const parts = pathname.split("/").filter(Boolean);

  const breadcrumbs = [];

  for (let i = 0; i < parts.length; i++) {
    const segment = parts[i];
    const path = `/${parts.slice(0, i + 1).join("/")}`;
    const prevSegment = parts[i - 1];

    // Check override first
    if (overrides[path]) {
      breadcrumbs.push({ href: path, title: overrides[path] });
      continue;
    }

    // Try to get name from database
    let title = segment;

    if (prevSegment === "posts") {
      const post = await db.post.findUnique({ where: { id: segment } });
      if (post?.title) {
        title = post.title;
      }
    }

    if (prevSegment === "products") {
      const product = await db.product.findUnique({ where: { id: segment } });
      if (product?.title) {
        title = product.title;
      }
    }

    // Format title if it's still the raw segment
    if (title === segment) {
      title = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    breadcrumbs.push({ href: path, title });
  }

  return (
    <nav>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <a href={link("/")}>Home</a>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span>/</span>
            <a href={crumb.href}>{crumb.title}</a>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export { Breadcrumbs };
