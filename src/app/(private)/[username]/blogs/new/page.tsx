import React from "react";
import CreateBlogView from "@/features/blogs/views/create-blog-view";
import CreateBlogWithAgentView from "@/features/blogs/views/create-blog-with-agent-view";

export default async function CreateBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ agent?: string }>;
}) {
  const { username } = await params;
  const { agent } = await searchParams;

  if (agent === "true") {
    return <CreateBlogWithAgentView username={username} />;
  }

  return <CreateBlogView username={username} />;
}
