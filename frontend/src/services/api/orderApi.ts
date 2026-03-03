import { API_BASE_URL } from "@/lib/config";
import { apiClient } from "@/lib/apiClient";

export interface CreateOrderData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  sendWhatsApp?: boolean;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  total: number;
  status: string;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  user: {
    id: string;
    name: string;
    phone: string;
    createdAt: string;
  };
}

export const orderApi = {
  create: async (data: CreateOrderData) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
  },

  getAll: async (): Promise<{ success: boolean; data: Order[] }> => {
    const res = await apiClient(`${API_BASE_URL}/api/orders`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  updateStatus: async (id: string, status: string) => {
    const res = await apiClient(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return res.json();
  },

  getByUserId: async (
    userId: string
  ): Promise<{ success: boolean; data: Order[] }> => {
    const res = await apiClient(`${API_BASE_URL}/api/orders/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user orders");
    return res.json();
  },
};
