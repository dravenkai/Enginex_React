import AssignProjectClient from "./AssignProjectClient";

export default async function AssignProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AssignProjectClient id={slug} />;
}
