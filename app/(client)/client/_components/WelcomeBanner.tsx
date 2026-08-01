export default function WelcomeBanner({
  name,
  activeRequests,
  engineerCount,
}: {
  name: string;
  activeRequests: number;
  engineerCount: number;
}) {
  return (
    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center min-h-[200px]">
      <h1 className="text-4xl font-bold mb-4">Welcome back, {name}.</h1>
      <p className="text-gray-600 max-w-md font-medium">
        You have {activeRequests} active requests and {engineerCount} engineers
        are currently reviewing your latest post. Everything is running
        smoothly.
      </p>
    </div>
  );
}
