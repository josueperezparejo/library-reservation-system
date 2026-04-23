import { create } from "zustand";
import type { Book } from "@/types";

interface BooksState {
  books: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  setBooks: (books: Book[]) => void;
  selectBook: (book: Book | null) => void;
  addBook: (book: Book) => void;
  updateBook: (updated: Book) => void;
  removeBook: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,
  setBooks: (books) => set({ books }),
  selectBook: (book) => set({ selectedBook: book }),
  addBook: (book) => set((state) => ({ books: [book, ...state.books] })),
  updateBook: (updated) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === updated.id ? updated : b)),
    })),
  removeBook: (id) =>
    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
