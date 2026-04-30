import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }

  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const location =
    (content.location as string | undefined) ||
    (content.address as string | undefined);
  const email = content.email as string | undefined;
  const category = (content.category as string | undefined) || "Profile";
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description, "Profile details will appear here once available.");
  const highlights = Array.isArray(content.highlights)
    ? content.highlights.filter((item): item is string => typeof item === "string").slice(0, 3)
    : [];
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#08111f_0%,#111c30_36%,#f6f7fb_36%,#f6f7fb_100%)]">
      <NavbarShell />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/8 shadow-[0_30px_90px_rgba(2,6,23,0.4)] backdrop-blur-sm">
          <div className="relative min-h-[240px] border-b border-white/10 bg-[#0c172b]">
            {logoUrl ? (
              <ContentImage src={logoUrl} alt={post.title} fill className="object-cover opacity-30" sizes="100vw" intrinsicWidth={1600} intrinsicHeight={720} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-[#07111f] via-[#0e1a30]/92 to-[#172845]/88" />
            <div className="relative grid gap-8 p-8 md:grid-cols-[220px_1fr] md:p-12">
              <div className="flex justify-center md:justify-start">
                <div className="relative h-40 w-40 overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm">
                  {logoUrl ? (
                    <ContentImage src={logoUrl} alt={post.title} fill className="object-cover" sizes="160px" intrinsicWidth={160} intrinsicHeight={160} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white/88">
                      {post.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-white">
                <Badge className="bg-white text-slate-950">{category}</Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{brandName}</h1>
                {domain ? (
                  <p className="mt-2 text-sm font-medium text-white/68">{domain}</p>
                ) : null}
                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300">
                  A cleaner profile surface for discovery, reputation, and quick trust signals.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {location ? (
                    <div className="rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">Location</p>
                      <p className="mt-2 text-sm font-semibold text-white">{location}</p>
                    </div>
                  ) : null}
                  {email ? (
                    <div className="rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">Contact</p>
                      <p className="mt-2 text-sm font-semibold text-white">{email}</p>
                    </div>
                  ) : null}
                  {website ? (
                    <div className="rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">Website</p>
                      <p className="mt-2 truncate text-sm font-semibold text-white">{domain}</p>
                    </div>
                  ) : null}
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">Status</p>
                    <p className="mt-2 text-sm font-semibold text-white">Featured profile</p>
                  </div>
                </div>
                {website ? (
                  <div className="mt-7">
                    <Button asChild size="lg" className="bg-white px-7 text-base text-slate-950 hover:bg-slate-200">
                      <Link href={website} target="_blank" rel="noopener noreferrer">
                        Visit Official Site
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-8 bg-[#f6f7fb] p-8 md:grid-cols-[1.15fr_0.85fr] md:p-12">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">About this profile</p>
              <RichContent html={descriptionHtml} className="mt-4 max-w-none text-slate-700" />
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Quick view</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {location ? <p>{location}</p> : null}
                  {email ? <p>{email}</p> : null}
                  {domain ? <p>{domain}</p> : null}
                </div>
              </div>
              {highlights.length ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-950">Highlights</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {highlights.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {suggestedArticles.length ? (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-950">Suggested articles</h2>
              <Link href="/articles" className="text-sm font-medium text-slate-700 hover:text-slate-950">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestedArticles.slice(0, 3).map((article) => (
                <TaskPostCard
                  key={article.id}
                  post={article}
                  href={buildPostUrl("article", article.slug)}
                  compact
                />
              ))}
            </div>
            <nav className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-950">Related links</p>
              <ul className="mt-2 space-y-2 text-sm">
                {suggestedArticles.slice(0, 3).map((article) => (
                  <li key={`related-${article.id}`}>
                    <Link
                      href={buildPostUrl("article", article.slug)}
                      className="text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/profile" className="text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline">
                    Browse all profiles
                  </Link>
                </li>
              </ul>
            </nav>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
