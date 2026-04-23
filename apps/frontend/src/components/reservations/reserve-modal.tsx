"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { ErrorMessage } from "@/components/ui/error-message";

import { GET_USERS } from "@/lib/graphql/queries/users";
import { useReservationsStore } from "@/store/reservations.store";
import { CREATE_RESERVATION } from "@/lib/graphql/mutations/reservations";

import type { User } from "@/types";

interface FormData {
  userId: string;
  reservationDate: string;
  dueDate: string;
}

interface ReserveModalProps {
  onSuccess?: () => void;
}

export function ReserveModal({ onSuccess }: ReserveModalProps) {
  const { isReserveModalOpen, bookIdForReservation, closeReserveModal } =
    useReservationsStore();
  const { data: usersData } = useQuery(GET_USERS);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userId: "",
      reservationDate: new Date().toISOString().split("T")[0],
      dueDate: "",
    },
  });

  const [createReservation, { loading, error }] = useMutation(
    CREATE_RESERVATION,
    {
      onCompleted: () => {
        reset();
        closeReserveModal();
        onSuccess?.();
      },
    },
  );

  const onSubmit = (data: FormData) => {
    createReservation({
      variables: {
        input: {
          userId: data.userId,
          bookId: bookIdForReservation,
          reservationDate: data.reservationDate,
          dueDate: data.dueDate,
        },
      },
    });
  };

  const handleClose = () => {
    reset();
    closeReserveModal();
  };

  const userOptions =
    usersData?.users?.map((u: User) => ({
      value: u.id,
      label: u.name,
      sublabel: u.email,
    })) ?? [];

  return (
    <Modal isOpen={isReserveModalOpen} onClose={handleClose} title="Reserve Book">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <ErrorMessage message={error.message} />}

        <Controller
          name="userId"
          control={control}
          rules={{ required: "Please select a user" }}
          render={({ field }) => (
            <Combobox
              label="Select User"
              placeholder="Choose a user..."
              searchPlaceholder="Search users..."
              options={userOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.userId?.message}
            />
          )}
        />

        <Controller
          name="reservationDate"
          control={control}
          rules={{ required: "Reservation date is required" }}
          render={({ field }) => (
            <DatePicker
              label="Reservation Date"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              error={errors.reservationDate?.message}
            />
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          rules={{ required: "Due date is required" }}
          render={({ field }) => (
            <DatePicker
              label="Due Date"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              error={errors.dueDate?.message}
            />
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Confirm Reservation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
