export type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type FormSettings = {
  formName: string;
  notificationEmail: string;
  introText: string;
  autoReplyText: string;
  thankYouMessage: string;
};

export type DashboardStats = {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
  last7Days: { label: string; count: number }[];
};
