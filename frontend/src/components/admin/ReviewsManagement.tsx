import { Star, MessageSquare } from "lucide-react";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useTableFilters } from "@/hooks/useTableFilters";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./TableSkeleton";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const ReviewsManagement = () => {
  const { reviews, loading, stats, toggleShowInHero, updating } =
    useAdminReviews();
  const {
    search,
    setSearch,
    currentPage,
    totalPages,
    paginatedData,
    filteredCount,
    handlePageChange,
  } = useTableFilters({
    data: reviews,
    searchFields: ["name", "comment"],
    pageSize: 10,
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        description="Customer reviews will appear here once submitted"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Featured in Hero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.heroCount}</div>
          </CardContent>
        </Card>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search reviews..."
      />

      {filteredCount === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews found"
          description="Try adjusting your search"
        />
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {paginatedData.length} of {filteredCount} reviews
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="max-w-md">Comment</TableHead>
                  <TableHead>Show in Hero</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2">{review.comment}</p>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={review.showInHero ? "default" : "outline"}
                        onClick={() =>
                          toggleShowInHero(review.id, review.showInHero)
                        }
                        disabled={updating === review.id}
                      >
                        {updating === review.id
                          ? "..."
                          : review.showInHero
                            ? "Yes"
                            : "No"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};
