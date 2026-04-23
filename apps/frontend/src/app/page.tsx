"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { BookOpen, Loader2, Search, X } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { ReserveModal } from "@/components/reservations/reserve-modal";

import { GET_BOOKS } from "@/lib/graphql/queries/books";

import type { Book } from "@/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_BOOKS);

  const books: Book[] = data?.books ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q),
    );
  }, [books, query]);

  const available = filtered.filter((b) => b.isAvailable).length;
  const reserved = filtered.filter((b) => !b.isAvailable).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
          <p className="mt-1 text-gray-500">
            Browse all books and reserve the ones that are available
          </p>
        </div>

        {!loading && books.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {available} available
            </span>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              {reserved} reserved
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {books.length} total
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author or ISBN..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load books: {error.message}
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-400">
              <BookOpen className="h-12 w-12" />
              {query ? (
                <>
                  <p className="text-lg font-medium">No books match "{query}"</p>
                  <button
                    onClick={() => setQuery("")}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <p className="text-lg font-medium">No books in the catalog yet</p>
              )}
            </div>
          ) : (
            <>
              {query && (
                <p className="text-sm text-gray-500">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-medium text-gray-700">"{query}"</span>
                </p>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} showReserveButton />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <ReserveModal onSuccess={() => refetch()} />
    </div>
  );
}
