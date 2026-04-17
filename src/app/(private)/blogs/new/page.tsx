import React from "react";
import CreateBlogView from "@/features/blogs/views/create-blog-view";
import CreateBlogWithAgentView from "@/features/blogs/views/create-blog-with-agent-view";

export default async function CreateBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;

  if (agent === "true") {
    return <CreateBlogWithAgentView />;
  }

  return <CreateBlogView />;
}
