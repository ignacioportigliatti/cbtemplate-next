"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import formbricks from "@formbricks/js";

export default function FormbricksProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("FormbricksProvider", process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID);
    formbricks.setup({
        environmentId: process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID || "",
        appUrl: "https://app.formbricks.com",
    });
    console.log("FormbricksProvider", formbricks);
  }, []);

  useEffect(() => {
    formbricks?.registerRouteChange();
  }, [pathname, searchParams]);

  return null;
}