import Image from "next/image";
import Link from "next/link";

interface RequestCardProps {
  id: string;
  title: string;
  status: "MATCHING" | "IN PROGRESS" | "FINAL REVIEW";
  description: string;
  engineerAvatar?: string;
  engineerName?: string;
  pendingCount?: number;
  actionLabel: "MANAGE" | "MESSAGE" | "APPROVE";
}

const statusColors = {
  MATCHING: "bg-[#fef08a] text-black",
  "IN PROGRESS": "bg-[#f2784a] text-white",
  "FINAL REVIEW": "bg-[#93c5fd] text-black",
};

export default function RequestCard({
  id,
  title,
  status,
  description,
  engineerAvatar,
  engineerName,
  pendingCount,
  actionLabel,
}: RequestCardProps) {
  return (
    <article className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`${statusColors[status]} border-2 border-black px-2 py-0.5 text-[10px] font-bold`}
        >
          {status}
        </span>
        <span className="text-gray-400 text-xs font-medium">#{id}</span>
      </div>

      <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 flex-1">{description}</p>

      <div className="border-t-2 border-black pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {engineerAvatar ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-black overflow-hidden relative">
                <Image
                  src={engineerAvatar}
                  alt={engineerName ?? ""}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold">{engineerName}</span>
            </div>
          ) : (
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 border-2 border-black bg-zinc-800 rounded-full" />
              <div className="w-8 h-8 border-2 border-black bg-white rounded-full flex items-center justify-center text-[10px] font-bold">
                +{pendingCount ?? 0}
              </div>
            </div>
          )}
        </div>

        <Link
          href={`/client/dashboard/requests/${id}`}
          className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-tighter"
        >
          {actionLabel}
        </Link>
      </div>
    </article>
  );
}
