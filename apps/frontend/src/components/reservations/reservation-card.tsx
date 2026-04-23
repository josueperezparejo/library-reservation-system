import { formatDate, isOverdue } from "@/lib/utils";
import { BookOpen, Calendar, RotateCcw, User2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Reservation } from "@/types";

interface ReservationCardProps {
  reservation: Reservation;
  onReturn?: (reservation: Reservation) => void;
  isReturning?: boolean;
}

export function ReservationCard({
  reservation,
  onReturn,
  isReturning = false,
}: ReservationCardProps) {
  const overdue = isOverdue(reservation.dueDate, reservation.status);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          {reservation.book && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="font-semibold text-gray-900">
                {reservation.book.title}
              </span>
            </div>
          )}
          {reservation.user && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User2 className="h-3.5 w-3.5 shrink-0" />
              <span>{reservation.user.name}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Reserved: {formatDate(reservation.reservationDate)}
            </span>
            <span className={overdue ? "font-medium text-red-600" : ""}>
              Due: {formatDate(reservation.dueDate)}
              {overdue && " (Overdue)"}
            </span>
            {reservation.returnDate && (
              <span className="text-green-600">
                Returned: {formatDate(reservation.returnDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={
              reservation.status === "RETURNED"
                ? "success"
                : overdue
                  ? "danger"
                  : "info"
            }
          >
            {reservation.status === "RETURNED"
              ? "Returned"
              : overdue
                ? "Overdue"
                : "Active"}
          </Badge>
          {reservation.status === "ACTIVE" && onReturn && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReturn(reservation)}
              isLoading={isReturning}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Return
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
