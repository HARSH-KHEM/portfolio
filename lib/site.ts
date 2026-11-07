const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harsh.is-a-dev.site";
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const SITE_NAME = "Harsh Khem";

export const SITE_ROLE = "Software Engineer, Full-Stack and GenAI Developer";

export const SITE_DESCRIPTION =
  "B.Tech Software Engineering student at DTU building high-performance full-stack web applications, low-level systems work, and intelligent LLM pipelines.";
