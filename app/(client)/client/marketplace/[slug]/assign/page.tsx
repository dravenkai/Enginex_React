import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getEngineer } from "../../_data";

const existingRequests = [
  { title: "HVAC Mapping #442", endsOn: "Oct 12" },
  { title: "Soil Analysis - Sector G", endsOn: "Sep 30" },
];

export default async function AssignProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const engineer = getEngineer(slug);
  if (!engineer) notFound();

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black leading-tight">Assign Project to Engineer</h1>
            <p className="mt-2 text-sm text-gray-600">
              Detailed specification for engineer{" "}
              <Link href={`/client/marketplace/${engineer.slug}`} className="text-blue-600 font-bold hover:underline">
                {engineer.name}
              </Link>{" "}
              ({engineer.role})
            </p>
          </section>

          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-8">
              <div className="bg-[#fdf6e3] border-2 border-black p-6">
                <h2 className="font-black text-xl uppercase mb-4">Select Your Project</h2>
                <select
                  defaultValue=""
                  className="w-full border-2 border-black px-4 py-3 text-sm font-medium bg-white focus:outline-none"
                >
                  <option value="" disabled>
                    Choose an active project to assign
                  </option>
                  <option value="hvac-mapping-442">HVAC Mapping #442</option>
                  <option value="soil-analysis-sector-g">Soil Analysis - Sector G</option>
                </select>
                <p className="mt-3 text-xs text-gray-500">
                  Only active projects eligible for {engineer.role.split(" / ")[0].toLowerCase()}{" "}
                  assignment are shown above.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-t-2 border-black">
              <p className="text-xs text-gray-500 max-w-sm">
                By submitting, you agree to the Enginex Master Service Agreement and data privacy
                protocols.
              </p>
              <button
                type="button"
                className="border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-8 py-3 font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all shrink-0"
              >
                Send Assignment Request
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="flex items-center justify-between bg-[#a68a1a] text-white px-5 py-4">
              <h2 className="font-black text-sm uppercase leading-tight">Existing Requests</h2>
              <span className="bg-white text-black border-2 border-black px-2 py-1 text-[10px] font-bold text-center leading-tight">
                {existingRequests.length}
                <br />
                Active
              </span>
            </div>
            <div className="bg-white p-5 space-y-3">
              <p className="text-xs text-gray-500">
                Reference current projects to avoid duplicates or link workflows.
              </p>
              {existingRequests.map((request) => (
                <button
                  key={request.title}
                  type="button"
                  className="w-full flex items-center justify-between gap-3 bg-gray-100 hover:bg-gray-200 border-2 border-black px-4 py-3 text-left transition-colors"
                >
                  <span>
                    <span className="block font-bold text-xs uppercase">{request.title}</span>
                    <span className="block text-[10px] text-gray-500 mt-1">
                      Ends: {request.endsOn}
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ))}
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-400 hover:border-black py-2.5 text-[10px] font-bold uppercase text-gray-500 hover:text-black transition-colors"
              >
                View Full History
              </button>
            </div>
          </section>

          <section className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={`https://picsum.photos/seed/${engineer.slug}-workspace/640/360`}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="bg-[#93c5fd] flex items-center gap-4 p-5">
              <div className="relative w-14 h-14 shrink-0 border-2 border-black overflow-hidden">
                <Image
                  src={engineer.photo}
                  alt={engineer.name}
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-black text-sm uppercase truncate">{engineer.name}</p>
                <p className="text-[10px] font-bold uppercase text-black/70 leading-tight">
                  Top 1% {engineer.category} Engineer
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
