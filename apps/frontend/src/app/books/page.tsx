"use client";

import { useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";

import { useBooksStore } from "@/store/books.store";

import { formatDate } from "@/lib/utils";
import { GET_BOOKS } from "@/lib/graphql/queries/books";
import { DELETE_BOOK } from "@/lib/graphql/mutations/books";

import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BookForm } from "@/components/books/book-form";

import type { Book } from "@/types";

export default function BooksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { removeBook } = useBooksStore();

  const { data, loading, refetch } = useQuery(GET_BOOKS);

  const books: Book[] = data?.books ?? [];
  const available = books.filter((b) => b.isAvailable).length;
  const reserved = books.filter((b) => !b.isAvailable).length;

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: (data) => {
      removeBook(data.deleteBook.id);
      refetch();
    },
  });

  const handleDeleteConfirm = () => {
    if (!deletingBook) return;
    setIsDeleting(true);
    deleteBook({ variables: { id: deletingBook.id } }).finally(() => {
      setIsDeleting(false);
      setDeletingBook(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <p className="mt-1 text-gray-500">Manage the library catalog</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && books.length > 0 && (
            <div className="flex items-center gap-2">
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
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Book</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Author
                </th>
                <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">
                  ISBN
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="hidden px-4 py-3 font-semibold text-gray-700 md:table-cell">
                  Added
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.books?.map((book: Book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {book.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{book.author}</td>
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                    {book.isbn}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={book.isAvailable ? "success" : "danger"}>
                      {book.isAvailable ? "Available" : "Reserved"}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                    {formatDate(book.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingBook(book)}
                        title="Edit book"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingBook(book)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Delete book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.books?.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No books in the catalog yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Book"
      >
        <BookForm
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book"
      >
        {editingBook && (
          <BookForm
            book={editingBook}
            onSuccess={() => {
              setEditingBook(null);
              refetch();
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete book"
        description={`Are you sure you want to delete "${deletingBook?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
