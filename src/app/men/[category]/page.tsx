import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function MenCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  redirect(`/men?category=${encodeURIComponent(category)}`);
}
