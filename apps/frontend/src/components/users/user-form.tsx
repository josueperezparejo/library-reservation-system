"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

import { CREATE_USER, UPDATE_USER } from "@/lib/graphql/mutations/users";

import type { User } from "@/types";

interface UserFormData {
  name: string;
  email: string;
}

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const [createUser, { loading: creating, error: createError }] = useMutation(
    CREATE_USER,
    { onCompleted: onSuccess },
  );

  const [updateUser, { loading: updating, error: updateError }] = useMutation(
    UPDATE_USER,
    { onCompleted: onSuccess },
  );

  const onSubmit = (data: UserFormData) => {
    if (isEditing) {
      updateUser({ variables: { input: { id: user.id, ...data } } });
    } else {
      createUser({ variables: { input: data } });
    }
  };

  const error = createError || updateError;
  const loading = creating || updating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorMessage message={error.message} />}

      <Input
        label="Full Name"
        placeholder="Alice Johnson"
        error={errors.name?.message}
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
        })}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="alice@library.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email address",
          },
        })}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditing ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
