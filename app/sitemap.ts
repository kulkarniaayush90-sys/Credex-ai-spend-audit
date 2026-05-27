import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return [
    {
      url: baseUrl.replace(/\/$/, ""),
      lastModified: new Date().toISOString()
    }
  ];
}
