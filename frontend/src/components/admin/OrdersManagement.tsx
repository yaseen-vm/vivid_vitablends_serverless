import { Package, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyState } from "./EmptyState";
import { Order, orderApi } from "@/services/api/orderApi";
import { useQuery } from "@tanstack/react-query";

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    PENDING: "secondary",
    CONFIRMED: "default",
    CANCELLED: "destructive",
    DELIVERED: "outline",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status}
    </Badge>
  );
};

const UserDetailsModal = ({ order }: { order: Order }) => {
  const { data: userOrders, isLoading } = useQuery({
    queryKey: ["user-orders", order.user.id],
    queryFn: () => orderApi.getByUserId(order.user.id),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
          <User className="w-4 h-4 mr-1" />
          {order.user.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>User ID: {order.user.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{order.user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <p className="text-sm text-muted-foreground">{order.user.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Customer Since</label>
            <p className="text-sm text-muted-foreground">
              {new Date(order.user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Order History</label>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="mt-2 space-y-2">
                {userOrders?.data?.map((userOrder) => (
                  <div
                    key={userOrder.id}
                    className="border rounded-lg p-3 text-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{userOrder.orderId}</span>
                      <Badge
                        variant={
                          userOrder.status === "DELIVERED"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {userOrder.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>
                        Items:{" "}
                        {userOrder.items
                          .map((i) => `${i.name} (${i.quantity})`)
                          .join(", ")}
                      </div>
                      <div>Total: ₹{userOrder.total}</div>
                      <div>
                        Date:{" "}
                        {new Date(userOrder.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OrderSection = ({
  title,
  orders,
  updateStatus,
}: {
  title: string;
  orders: Order[];
  updateStatus: (id: string, status: string) => void;
}) => {
  if (orders.length === 0) return null;

  const getAvailableStatuses = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["DELIVERED", "CANCELLED"],
      CANCELLED: [],
      DELIVERED: [],
    };
    return transitions[currentStatus] || [];
  };

  const hasActions = orders.some(
    (o) => getAvailableStatuses(o.status).length > 0
  );

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      CONFIRMED: "Confirm",
      CANCELLED: "Cancel",
      DELIVERED: "Mark Delivered",
    };
    return labels[status] || status;
  };

  const getButtonVariant = (status: string) => {
    if (status === "CONFIRMED") return "default";
    if (status === "CANCELLED") return "destructive";
    if (status === "DELIVERED") return "outline";
    return "secondary";
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          {title} ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              {hasActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const availableStatuses = getAvailableStatuses(order.status);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <UserDetailsModal order={order} />
                  </TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>
                    <div className="text-sm max-w-[200px]">
                      {order.items.map((item, i) => (
                        <div key={item.id}>
                          {item.name} × {item.quantity}
                          {i < order.items.length - 1 && ", "}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  {hasActions && (
                    <TableCell>
                      <div className="flex gap-2">
                        {availableStatuses.map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={getButtonVariant(status)}
                            onClick={() => updateStatus(order.id, status)}
                          >
                            {getStatusLabel(status)}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const OrdersManagement = () => {
  const { orders, loading, updateStatus } = useAdminOrders();

  if (loading) {
    return <TableSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Orders will appear here once customers place them"
      />
    );
  }

  const pendingOrders = orders.filter(
    (o) => !o.status || o.status.toUpperCase() === "PENDING"
  );
  const confirmedOrders = orders.filter(
    (o) => o.status?.toUpperCase() === "CONFIRMED"
  );
  const cancelledOrders = orders.filter(
    (o) => o.status?.toUpperCase() === "CANCELLED"
  );
  const deliveredOrders = orders.filter(
    (o) => o.status?.toUpperCase() === "DELIVERED"
  );

  const hasAnyOrders =
    pendingOrders.length > 0 ||
    confirmedOrders.length > 0 ||
    cancelledOrders.length > 0 ||
    deliveredOrders.length > 0;

  if (!hasAnyOrders) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-muted-foreground">
            Manage customer orders by status
          </p>
        </div>
        <EmptyState
          icon={Package}
          title="No orders to display"
          description="Orders will be organized by status once they are created"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <p className="text-muted-foreground">
          Manage customer orders by status
        </p>
      </div>

      <OrderSection
        title="Pending - Redirected to WhatsApp"
        orders={pendingOrders}
        updateStatus={updateStatus}
      />
      <OrderSection
        title="Confirmed - Admin confirmed via WhatsApp"
        orders={confirmedOrders}
        updateStatus={updateStatus}
      />
      <OrderSection
        title="Cancelled - Order cancelled"
        orders={cancelledOrders}
        updateStatus={updateStatus}
      />
      <OrderSection
        title="Delivered - Successfully delivered"
        orders={deliveredOrders}
        updateStatus={updateStatus}
      />
    </div>
  );
};
