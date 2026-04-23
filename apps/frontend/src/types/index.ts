export type ReservationStatus = "ACTIVE" | "RETURNED";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  coverUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: string;
  dueDate: string;
  returnDate?: string;
  status: ReservationStatus;
  user?: User;
  book?: Book;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReservations {
  items: Reservation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}
