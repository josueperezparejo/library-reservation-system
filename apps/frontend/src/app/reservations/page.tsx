"use client";

import { useState } from "react";

import { Search, Loader2, X } from "lucide-react";
import { useLazyQuery, useQuery } from "@apollo/client";

import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { ReservationCard } from "@/components/reservations/reservation-card";

import { GET_BOOKS } from "@/lib/graphql/queries/books";
import { GET_USERS } from "@/lib/graphql/queries/users";
import {
  GET_ALL_RESERVATIONS,
  GET_RESERVATIONS_BY_BOOK,
  GET_RESERVATIONS_BY_USER,
} from "@/lib/graphql/queries/reservations";

import type { Book, Reservation, User } from "@/types";

type FilterMode = "book" | "user";

export default function ReservationsPage() {
  const [mode, setMode] = useState<FilterMode>("user");
  const [selectedId, setSelectedId] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const { data: booksData } = useQuery(GET_BOOKS);
  const { data: usersData } = useQuery(GET_USERS);

  const { data: allData, loading: allLoading } = useQuery(GET_ALL_RESERVATIONS, {
    variables: { page: 1, limit: 50 },
  });

  const [fetchByBook, { data: byBookData, loading: byBookLoading }] =
    useLazyQuery(GET_RESERVATIONS_BY_BOOK, { fetchPolicy: "network-only" });
  const [fetchByUser, { data: byUserData, loading: byUserLoading }] =
    useLazyQuery(GET_RESERVATIONS_BY_USER, { fetchPolicy: "network-only" });

  const handleSearch = () => {
    if (!selectedId) return;

    const variables = {
      [mode === "book" ? "bookId" : "userId"]: selectedId,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page: 1,
      limit: 50,
    };

    if (mode === "book") fetchByBook({ variables });
    else fetchByUser({ variables });

    setIsFiltered(true);
  };

  const handleClear = () => {
    setSelectedId("");
    setFromDate("");
    setToDate("");
    setIsFiltered(false);
  };

  const filterLoading = byBookLoading || byUserLoading;
  const filteredResult =
    mode === "book"
      ? byBookData?.reservationsByBook
      : byUserData?.reservationsByUser;

  const result = isFiltered ? filteredResult : allData?.reservations;
  const loading = isFiltered ? filterLoading : allLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <p className="mt-1 text-gray-500">
          All reservations ordered by most recent — filter by book or user if needed
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Combobox
            label="Filter by"
            searchable={false}
            value={mode}
            onChange={(val) => {
              setMode((val || "user") as FilterMode);
              setSelectedId("");
            }}
            options={[
              { value: "user", label: "By User" },
              { value: "book", label: "By Book" },
            ]}
          />

          {mode === "book" ? (
            <Combobox
              label="Select Book"
              placeholder="Choose a book..."
              searchPlaceholder="Search books..."
              value={selectedId}
              onChange={(val) => setSelectedId(val)}
              options={(booksData?.books ?? []).map((b: Book) => ({
                value: b.id,
                label: b.title,
                sublabel: b.author,
              }))}
            />
          ) : (
            <Combobox
              label="Select User"
              placeholder="Choose a user..."
              searchPlaceholder="Search users..."
              value={selectedId}
              onChange={(val) => setSelectedId(val)}
              options={(usersData?.users ?? []).map((u: User) => ({
                value: u.id,
                label: u.name,
                sublabel: u.email,
              }))}
            />
          )}

          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={setFromDate}
            placeholder="Start date"
          />
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={setToDate}
            placeholder="End date"
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          {isFiltered && (
            <Button variant="outline" onClick={handleClear}>
              <X className="h-4 w-4" />
              Clear filter
            </Button>
          )}
          <Button
            onClick={handleSearch}
            disabled={!selectedId}
            isLoading={filterLoading}
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        </div>
      )}

      {!loading && result && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {isFiltered ? "Filtered: " : "Showing "}
            <strong>{result.total}</strong> reservation
            {result.total !== 1 ? "s" : ""}
          </p>
          {result.items.length > 0 ? (
            <div className="space-y-3">
              {result.items.map((r: Reservation) => (
                <ReservationCard key={r.id} reservation={r} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-400">
              No reservations found for the selected filters
            </p>
          )}
        </div>
      )}

      {!loading && !result && (
        <p className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-400">
          No reservations yet
        </p>
      )}
    </div>
  );
}
