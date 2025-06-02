import React from "react";
import { link } from "../shared/links";
import { db } from "@/db";

const Breadcrumbs = ({ currentUrl }: { currentUrl: string }) => {
  // get the current URL
  console.log({ currentUrl });

  const pathname = new URL(currentUrl).pathname;
  const pathnameParts = pathname.split("/").filter(Boolean);
  console.log({ pathnameParts });

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <a href={link("/")}>Home</a> /
      {pathnameParts.map((part, index) => (
        <React.Fragment key={index}>
          <a
            href={`/${pathnameParts.slice(0, index + 1).join("/")}`}
            style={{ textTransform: "capitalize" }}
          >
            {part}
          </a>
          {index < pathnameParts.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Breadcrumbs };
