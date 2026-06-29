import { notFound } from "next/navigation";
import { fetchPortfolio } from "@/lib/api";
import type { Metadata } from "next";
import ProjectDetail from "./ProjectDetail";

interface Props {
  params: { slug: string };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaurav-rauthan.vercel.app";

export async function generateStaticParams() {
  try {
    const data = await fetchPortfolio();
    return data.projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await fetchPortfolio();
    const project = data.projects.find((p) => p.slug === params.slug);
    if (!project) return { title: "Project Not Found" };

    const projectUrl = `/projects/${project.slug}`;
    const ogImage = project.image_url || undefined;

    return {
      title: project.title,
      description: project.description,
      alternates: { canonical: projectUrl },
      openGraph: {
        title: `${project.title} | Gaurav Rauthan`,
        description: project.description,
        url: projectUrl,
        type: "article",
        images: ogImage ? [{ url: ogImage, alt: project.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title} | Gaurav Rauthan`,
        description: project.description,
        images: ogImage ? [ogImage] : undefined,
      },
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

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: project.live_url || `${SITE_URL}/projects/${project.slug}`,
    image: project.image_url || undefined,
    author: {
      "@type": "Person",
      name: "Gaurav Rauthan",
      url: SITE_URL,
    },
    keywords: project.tech_stack.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <ProjectDetail project={project} otherProjects={otherProjects} />
    </>
  );
}
