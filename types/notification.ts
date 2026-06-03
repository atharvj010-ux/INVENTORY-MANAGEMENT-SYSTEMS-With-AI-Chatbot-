export type NotificationType = "low_stock" | "out_of_stock" | "info";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: string;
};
