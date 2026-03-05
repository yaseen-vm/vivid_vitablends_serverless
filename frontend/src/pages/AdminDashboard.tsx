import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Star, ShoppingCart, LogOut, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { ReviewsManagement } from "@/components/admin/ReviewsManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useCategories } from "@/hooks/useCategories";
import { authStorage } from "@/lib/storage";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, isLoading: logoutLoading } = useAdminAuth();
  const { products, stats: productStats } = useAdminProducts();
  const { stats: reviewStats, loading: reviewsLoading } = useAdminReviews();
  const { orders, loading: ordersLoading } = useAdminOrders();
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    if (!authStorage.getAuth()) {
      navigate("/sys-admin-portal");
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--warm-cream))] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--primary))]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your products, categories, and reviews
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={logoutLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />{" "}
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-[var(--card-shadow)] hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">
                    {categoriesLoading ? "..." : categories.length}
                  </div>
                  {!categoriesLoading && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {categories.filter((c) => c.showOnHome).length} on
                      homepage
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--card-shadow)] hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">
                    {products ? productStats.total : "..."}
                  </div>
                  {products && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {productStats.featuredCount} featured
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--card-shadow)] hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Rating
                  </CardTitle>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">
                    {reviewsLoading
                      ? "..."
                      : reviewStats.averageRating.toFixed(1)}
                  </div>
                  {!reviewsLoading && (
                    <p className="text-xs text-muted-foreground mt-2">
                      From {reviewStats.total} reviews
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--card-shadow)] hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">
                    {ordersLoading ? "..." : orders.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total orders
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
