import { notFound } from "next/navigation";
import { fetchPortfolio } from "@/lib/api";
import type { Metadata } from "next";
import ProjectDetail from "./ProjectDetail";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await fetchPortfolio();
    const project = data.projects.find((p) => p.slug === params.slug);
    if (!project) return { title: "Project Not Found" };
    return {
      title: `${project.title} | Gaurav Rauthan`,
      description: project.description,
      icons: { icon: "/favicon.svg" },
    };
  } catch {
    return { title: "Project | Gaurav Rauthan" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const data = await fetchPortfolio();
  const project = data.projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const otherProjects = data.projects
    .filter((p) => p.slug !== params.slug)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return <ProjectDetail project={project} otherProjects={otherProjects} />;
}
