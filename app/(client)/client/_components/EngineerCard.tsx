interface EngineerCardProps {
  name: string;
  role: string;
  avatar: string;
  tags: string[];
}

export default function EngineerCard({
  name,
  role,
  avatar,
  tags,
}: EngineerCardProps) {
  return (
    <div className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col min-w-[240px]">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 border-2 border-black overflow-hidden bg-orange-100">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-lg leading-tight">{name}</h4>
          <p className="text-blue-500 text-xs font-bold">{role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-black px-1.5 py-0.5 text-[9px] font-bold uppercase bg-gray-50"
          >
            {tag}
          </span>
        ))}
      </div>

      <button className="w-full py-2 bg-[#93c5fd] border-2 border-black font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
        View Profile
      </button>
    </div>
  );
}
