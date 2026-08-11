import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { getProject } from "../../_data";
import ApplyPanel from "./ApplyPanel";

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const project = getProject(postId);
  if (!project) notFound();

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <span className="inline-block border-2 border-black bg-orange-400 text-white px-3 py-1 text-xs font-bold uppercase">
            Project Case Study
          </span>
          <h1 className="text-4xl font-black leading-tight">{project.title}</h1>
          <p className="text-blue-600 font-bold">{project.projectRef}</p>

          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative aspect-video border-b-4 border-black">
              <Image
                src={project.image}
                alt={project.title}
                fill
                unoptimized
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-2 border-black bg-[#fef08a] px-2 py-1 text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="font-bold text-lg uppercase underline decoration-2 underline-offset-4 mb-3">
                Project Brief
              </h2>
              <p className="text-sm text-gray-700 leading-6 mb-8">{project.brief}</p>

              <h2 className="font-bold text-lg uppercase underline decoration-2 underline-offset-4 mb-4">
                Technical Challenges
              </h2>
              <div className="space-y-4">
                {project.technicalChallenges.map((challenge) => (
                  <div key={challenge.title} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">{challenge.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{challenge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 bg-white border-3 border-black p-6 ml-36 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-sm uppercase mb-2">Budget Range</p>
              <p className="text-blue-600 font-black text-xl leading-tight">
                {project.budgetRange}
              </p>
              <p className="text-blue-600 font-black text-xl leading-tight">
                -
              </p>
              <p className="text-blue-600 font-black text-xl leading-tight">
                {project.budgetRange1}
              </p>
            </div>
            <div className=" w-54 h-30 bg-white border-3 border-black p-6 mr-36 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-sm uppercase mb-2">Target Timeline</p>
              <p className="text-orange-500 font-black text-xl">{project.targetTimeline}</p>
            </div>
          </div>
        </div>

        <div className="pt-42">
          <ApplyPanel project={project} />
        </div>
      </div>
    </div>
  );
}
