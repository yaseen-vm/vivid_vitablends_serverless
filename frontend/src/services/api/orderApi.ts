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
};
