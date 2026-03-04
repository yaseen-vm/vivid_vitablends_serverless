import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/services/api/productApi";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@/types/Category";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const CategoryManagement = () => {
  const { categories, loading } = useCategories();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleToggleHomepage = async (
    categoryId: string,
    currentValue: boolean,
    displayOrder: number
  ) => {
    setUpdating(categoryId);
    try {
      await categoryApi.updateHomepageVisibility(
        categoryId,
        !currentValue,
        displayOrder
      );
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category visibility updated");
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setUpdating(null);
    }
  };

  const handleDisplayOrderChange = async (
    categoryId: string,
    showOnHome: boolean,
    newOrder: number
  ) => {
    setUpdating(categoryId);
    try {
      await categoryApi.updateHomepageVisibility(
        categoryId,
        showOnHome,
        newOrder
      );
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Display order updated");
    } catch (error) {
      toast.error("Failed to update display order");
    } finally {
      setUpdating(null);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, or WebP)");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setUpdating(editingCategory.id);
    try {
      await categoryApi.update(editingCategory.id, formData);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      setEditingCategory(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update category";
      toast.error(message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Manage categories, their details, and homepage visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border p-3 space-y-3"
              >
                <div className="flex items-start gap-3">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold capitalize">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                    className="shrink-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`order-${category.id}`} className="text-sm">
                      Order:
                    </Label>
                    <Input
                      id={`order-${category.id}`}
                      type="number"
                      min="0"
                      value={category.displayOrder}
                      onChange={(e) =>
                        handleDisplayOrderChange(
                          category.id,
                          category.showOnHome,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-16"
                      disabled={updating === category.id}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`show-${category.id}`} className="text-sm">
                      Homepage:
                    </Label>
                    <Switch
                      id={`show-${category.id}`}
                      checked={category.showOnHome}
                      onCheckedChange={() =>
                        handleToggleHomepage(
                          category.id,
                          category.showOnHome,
                          category.displayOrder
                        )
                      }
                      disabled={updating === category.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!editingCategory}
        onOpenChange={() => setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category name, description, and image
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Max size: 5MB. Formats: JPEG, PNG, WebP
              </p>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 h-24 w-24 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating === editingCategory?.id}
            >
              {updating === editingCategory?.id ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManagement;
