import { API_BASE_URL } from "@/lib/config";

export interface CreateMessageData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const messageApi = {
  create: async (data: CreateMessageData) => {
    const res = await fetch(`${API_BASE_URL}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        rating: 5,
        comment: data.message,
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    const json = await res.json();
    return json.data || json;
  },
};
