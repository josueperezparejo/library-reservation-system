"use client";

import { useState, useMemo } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { RotateCcw, Loader2, CheckCircle } from "lucide-react";

import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { ReservationCard } from "@/components/reservations/reservation-card";

import { GET_USERS } from "@/lib/graphql/queries/users";
import { GET_ALL_RESERVATIONS } from "@/lib/graphql/queries/reservations";
import { RETURN_BOOK } from "@/lib/graphql/mutations/reservations";

import type { Reservation, User } from "@/types";

export default function ReturnsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [returnedId, setReturnedId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  const { data: usersData } = useQuery(GET_USERS);

  const { data, loading, refetch } = useQuery(GET_ALL_RESERVATIONS, {
    variables: { page: 1, limit: 100 },
  });

  const [returnBook] = useMutation(RETURN_BOOK, {
    onCompleted: (data) => {
      setReturnedId(data.returnBook.id);
      setReturningId(null);
      refetch();
      setTimeout(() => setReturnedId(null), 3000);
    },
    onError: () => setReturningId(null),
  });

  const handleReturn = (reservation: Reservation) => {
    setReturningId(reservation.id);
    returnBook({ variables: { reservationId: reservation.id } });
  };

  const allActive: Reservation[] = useMemo(() => {
    const all: Reservation[] = data?.reservations?.items ?? [];
    return all.filter((r) => r.status === "ACTIVE");
  }, [data]);

  const activeReservations = useMemo(() => {
    if (!selectedUserId) return allActive;
    return allActive.filter((r) => r.userId === selectedUserId);
  }, [allActive, selectedUserId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <RotateCcw className="h-8 w-8 text-blue-500" />
            Return Books
          </h1>
          <p className="mt-1 text-gray-500">
            All active reservations — filter by user if needed
          </p>
        </div>
        {!loading && allActive.length > 0 && (
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {allActive.length} pending return{allActive.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {returnedId && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <CheckCircle className="h-4 w-4" />
          Book returned successfully!
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Combobox
          label="Filter by user"
          placeholder="All users"
          searchPlaceholder="Search users..."
          value={selectedUserId}
          onChange={(val) => setSelectedUserId(val)}
          options={(usersData?.users ?? []).map((u: User) => ({
            value: u.id,
            label: u.name,
            sublabel: u.email,
          }))}
        />
      </div>

      {loading && (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Reservations
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({activeReservations.length}{selectedUserId ? " for selected user" : " total"})
            </span>
          </h2>

          {activeReservations.length > 0 ? (
            <div className="space-y-3">
              {activeReservations.map((r: Reservation) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  onReturn={handleReturn}
                  isReturning={returningId === r.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-400">
              <RotateCcw className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>
                {selectedUserId
                  ? "No active reservations for this user"
                  : "No active reservations"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
