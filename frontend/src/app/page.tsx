import type { Metadata } from "next";
import { fetchPortfolio } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaurav-rauthan.vercel.app";

export default async function HomePage() {
  try {
    const data = await fetchPortfolio();

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: data.profile.name,
      jobTitle: data.profile.title.split("|")[0].trim(),
      description: data.profile.bio,
      url: SITE_URL,
      email: data.profile.email,
      sameAs: [
        data.profile.social_links?.github,
        data.profile.social_links?.linkedin,
      ].filter(Boolean),
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${data.profile.name} Portfolio`,
      url: SITE_URL,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navbar resumeUrl={data.profile.resume_url} />
        <main>
          <Hero profile={data.profile} />
          <About profile={data.profile} />
          <Experience items={data.experience} />
          <Projects items={data.projects} />
          <Skills categories={data.skills} />
          <Contact profile={data.profile} />
        </main>
        <Footer
          socialLinks={{
            github: data.profile.social_links?.github,
            linkedin: data.profile.social_links?.linkedin,
            email: data.profile.email,
          }}
        />
      </>
    );
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            Unable to load portfolio data. Please try again later.
          </p>
          <a
            href="/"
            className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-lg px-6 py-3 font-medium transition-colors"
          >
            Refresh Page
          </a>
        </div>
      </div>
    );
  }
}
