export default function WelcomeBanner({
  name,
  engineerCount,
}: {
  name: string;
  engineerCount: number;
}) {
  return (
    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center min-h-[200px]">
      <h1 className="text-3xl font-bold mb-4">Welcome back{name ? `, ${name}` : ""}.</h1>
      <p className="text-gray-600 max-w-md font-medium text-sm">
        {engineerCount} verified engineer{engineerCount === 1 ? "" : "s"} are ready to take on your
        next project.
      </p>
    </div>
  );
}
