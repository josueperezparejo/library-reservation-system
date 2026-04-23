"use client";

import Image from "next/image";
import { BookOpen, User2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useReservationsStore } from "@/store/reservations.store";

import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  showReserveButton?: boolean;
}

export function BookCard({ book, showReserveButton = false }: BookCardProps) {
  const openReserveModal = useReservationsStore((s) => s.openReserveModal);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 bg-gray-100">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-300" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant={book.isAvailable ? "success" : "danger"}>
            {book.isAvailable ? "Available" : "Reserved"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900">
          {book.title}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <User2 className="h-3.5 w-3.5" />
          <span>{book.author}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">ISBN: {book.isbn}</p>
        {book.description && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-600">
            {book.description}
          </p>
        )}

        {showReserveButton && book.isAvailable && (
          <div className="mt-4">
            <Button
              size="sm"
              className="w-full"
              onClick={() => openReserveModal(book.id)}
            >
              Reserve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
