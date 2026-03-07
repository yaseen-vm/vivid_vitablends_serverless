import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Inbox } from "lucide-react";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyState } from "./EmptyState";
import { apiClient } from "@/lib/apiClient";
import { API_BASE_URL } from "@/lib/config";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

const fetchMessages = async (): Promise<Message[]> => {
  const token = sessionStorage.getItem("adminToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await apiClient(`${API_BASE_URL}/api/messages`);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data = await response.json();
  return data.data?.messages || [];
};

export const MessagesManagement = () => {
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: fetchMessages,
    retry: false,
  });

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            {error instanceof Error &&
            error.message === "Authentication required"
              ? "Please log in again to view messages"
              : "Failed to load messages"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!messages?.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="No messages"
        description="No customer messages have been received yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Badge variant="secondary">{messages.length} total</Badge>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {message.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                {message.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <a
                      href={`tel:${message.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {message.phone}
                    </a>
                  </div>
                )}
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
