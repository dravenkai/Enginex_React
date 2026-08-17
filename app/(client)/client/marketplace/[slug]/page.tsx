import EngineerDetailClient from "./EngineerDetailClient";

export default async function EngineerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EngineerDetailClient id={slug} />;
}
