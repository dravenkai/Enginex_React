import MarketplaceProjectDetailClient from "./MarketplaceProjectDetailClient";

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <MarketplaceProjectDetailClient id={postId} />;
}
