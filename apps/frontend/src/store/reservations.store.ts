import { create } from "zustand";
import type { Reservation, User } from "@/types";

interface ReservationsState {
  activeUser: User | null;
  reservationToReturn: Reservation | null;
  isReserveModalOpen: boolean;
  bookIdForReservation: string | null;
  setActiveUser: (user: User | null) => void;
  openReserveModal: (bookId: string) => void;
  closeReserveModal: () => void;
  setReservationToReturn: (reservation: Reservation | null) => void;
}

export const useReservationsStore = create<ReservationsState>((set) => ({
  activeUser: null,
  reservationToReturn: null,
  isReserveModalOpen: false,
  bookIdForReservation: null,
  setActiveUser: (user) => set({ activeUser: user }),
  openReserveModal: (bookId) =>
    set({ isReserveModalOpen: true, bookIdForReservation: bookId }),
  closeReserveModal: () =>
    set({ isReserveModalOpen: false, bookIdForReservation: null }),
  setReservationToReturn: (reservation) =>
    set({ reservationToReturn: reservation }),
}));
