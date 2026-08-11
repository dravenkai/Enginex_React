import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Heart } from "lucide-react";
import { getEngineer } from "../_data";

const badgeStyles = {
  Verified: "bg-[#fef08a] text-black",
  New: "bg-orange-400 text-white",
};

export default async function EngineerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const engineer = getEngineer(slug);
  if (!engineer) notFound();

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <section className="relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div
          className="absolute -right-6 -top-6 w-28 h-28 bg-[#dbe6fb] border-2 border-black rotate-12"
          aria-hidden
        />
        <div className="relative flex flex-col sm:flex-row gap-8">
          <div className="relative w-40 h-40 shrink-0 border-2 border-black overflow-hidden">
            <Image
              src={engineer.photo}
              alt={engineer.name}
              fill
              unoptimized
              sizes="160px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black">{engineer.name}</h1>
              {engineer.badge && (
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase ${badgeStyles[engineer.badge]}`}
                >
                  {engineer.badge === "Verified" ? "Verified Engineer" : "New"}
                </span>
              )}
            </div>
            <p className="text-blue-600 font-bold uppercase text-sm tracking-wide mt-1">
              {engineer.role}
            </p>

            <div className="flex flex-wrap gap-8 mt-5 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">Location</p>
                <p className="font-bold">{engineer.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">Experience</p>
                <p className="font-bold">{engineer.experience}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">Completed</p>
                <p className="font-bold">{engineer.completedProjects} Projects</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                href={`/client/marketplace/${engineer.slug}/assign`}
                className="px-8 py-3 bg-[#93c5fd] hover:bg-[#7ca3ef] border-3 border-black font-bold text-sm uppercase transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Request Service
              </Link>
              <button
                type="button"
                aria-label="Add to favorites"
                className="w-20 h-12 border-3 border-black hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-bold text-lg uppercase pb-3 mb-4 border-b-2 border-black">
            Technical Expertise
          </h2>
          <div className="space-y-4">
            {engineer.bio.map((paragraph, index) => (
              <p key={index} className="text-sm text-gray-700 leading-6">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section className="bg-[#dbe6fb] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase mb-4">Core Specs</h2>

            <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Primary Focus</p>
            <div className="bg-white border-2 border-black px-3 py-2 text-sm font-bold text-blue-600 mb-4">
              {engineer.primaryFocus}
            </div>

            <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Tools &amp; Stack</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {engineer.toolsStack.map((tool) => (
                <span
                  key={tool}
                  className="bg-white border-2 border-black px-2 py-1 text-[10px] font-bold"
                >
                  {tool}
                </span>
              ))}
            </div>

            <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Certifications</p>
            <div className="space-y-1.5">
              {engineer.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase pb-3 mb-3 border-b-2 border-black">
              Availability
            </h2>
            <div className="flex items-center gap-2 text-sm font-bold mb-4">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  engineer.availableNow ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {engineer.availableNow ? "Taking new requests" : "Not currently available"}
            </div>
            <div className="space-y-2 pt-3 border-t-2 border-black text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Hourly Rate:</span>
                <span className="font-bold">{engineer.hourlyRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Typical Response:</span>
                <span className="font-bold">{engineer.responseTime}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg uppercase">Project Portfolio</h2>
          <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
            View Full Archive
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {engineer.portfolio.map((project) => (
            <article
              key={project.title}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              <div className="relative aspect-video border-b-4 border-black">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-sm uppercase leading-tight">{project.title}</h3>
                  <span className="border-2 border-black bg-orange-100 px-2 py-0.5 text-[10px] font-bold shrink-0">
                    {project.year}
                  </span>
                </div>
                <p className="text-sm text-gray-600 flex-1 mb-4">{project.description}</p>
                <button
                  type="button"
                  className="w-full border-2 border-black py-2.5 text-xs font-bold uppercase hover:bg-gray-100 transition-colors"
                >
                  Case Study
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
