export type Task = {
  userId: string;
  finished_at: number;
  attachments: string;
  name: string;
};

export type User = {
  displayName: string | null;
  photoURL: string | null;
  uid: string | null;
};
