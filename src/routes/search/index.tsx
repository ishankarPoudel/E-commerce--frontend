import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import SearchResult from "@/ui/pages/Customer/Search/SearchResult";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/search/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
    category: (search.category as string) || "",
    categoryId: (search.categoryId as string) || "",
  }),
});

function RouteComponent() {
  const search = useSearch({ from: "/search/" });
  console.log("Search Params in RouteComponent:", search.q);
  return (
    <>
      <LandingPageLayout>
        <SearchResult
          q={search.q}
          category={search.category}
          categoryId={search.categoryId}
        />
      </LandingPageLayout>
    </>
  );
}
