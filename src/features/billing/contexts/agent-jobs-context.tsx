"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { toastAgentSuccess } from "../components/handle-creating-toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type JobType = "recipe" | "blog";

type AgentJob = {
  /** Unique ID — we reuse the ISO startTime string */
  id: string;
  type: JobType;
  /** ISO timestamp: only recipes/blogs created AFTER this are considered */
  after: string;
  username: string;
};

type AgentJobsContextValue = {
  addJob: (job: Omit<AgentJob, "id">) => void;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AgentJobsContext = createContext<AgentJobsContextValue>({
  addJob: () => {},
});

export const useAgentJobs = () => useContext(AgentJobsContext);

// ---------------------------------------------------------------------------
// Module-level set — survives StrictMode unmount/remount cycles
// Prevents toast from firing twice for the same job id
// ---------------------------------------------------------------------------

const completedJobIds = new Set<string>();

// ---------------------------------------------------------------------------
// Per-job poller components (each renders null, just does the query + effect)
// ---------------------------------------------------------------------------

function RecipeJobPoller({
  job,
  onComplete,
}: {
  job: AgentJob;
  onComplete: (jobId: string) => void;
}) {
  const trpc = useTRPC();
  const router = useRouter();

  const { data } = useQuery({
    ...trpc.recipes.getLatestCreatedAfter.queryOptions({ after: job.after }),
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (!data || completedJobIds.has(job.id)) return;
    completedJobIds.add(job.id);
    onComplete(job.id);

    const recipeUrl = `/${job.username}/recipes?recipeSlug=${data.slug}`;
    toastAgentSuccess({
      title: "Your recipe is ready! 🎉",
      description: `"${data.title}" has been added to your collection.`,
      actionLabel: "View recipe →",
      onAction: () => router.push(recipeUrl),
    });
  }, [data, job, onComplete, router]);

  return null;
}

function BlogJobPoller({
  job,
  onComplete,
}: {
  job: AgentJob;
  onComplete: (jobId: string) => void;
}) {
  const trpc = useTRPC();
  const router = useRouter();

  const { data } = useQuery({
    ...trpc.blogs.getLatestCreatedAfter.queryOptions({ after: job.after }),
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (!data || completedJobIds.has(job.id)) return;
    completedJobIds.add(job.id);
    onComplete(job.id);

    const blogUrl = `/${job.username}/blogs?blogSlug=${data.slug}`;
    toastAgentSuccess({
      title: "Your blog post is ready! 🎉",
      description: `"${data.title}" has been added to your collection.`,
      actionLabel: "View post →",
      onAction: () => router.push(blogUrl),
    });
  }, [data, job, onComplete, router]);

  return null;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AgentJobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<AgentJob[]>([]);

  const addJob = useCallback((job: Omit<AgentJob, "id">) => {
    setJobs((prev) => {
      // Deduplicate: if a job with this timestamp already exists, ignore
      if (prev.some((j) => j.id === job.after)) return prev;
      return [...prev, { ...job, id: job.after }];
    });
  }, []);

  const removeJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  return (
    <AgentJobsContext.Provider value={{ addJob }}>
      {children}
      {jobs.map((job) =>
        job.type === "recipe" ? (
          <RecipeJobPoller key={job.id} job={job} onComplete={removeJob} />
        ) : (
          <BlogJobPoller key={job.id} job={job} onComplete={removeJob} />
        ),
      )}
    </AgentJobsContext.Provider>
  );
}
