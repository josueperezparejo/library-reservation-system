"use client";

import { useForm } from "react-hook-form";

import { useMutation } from "@apollo/client";
import { useBooksStore } from "@/store/books.store";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

import { CREATE_BOOK, UPDATE_BOOK } from "@/lib/graphql/mutations/books";

import type { Book } from "@/types";

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverUrl: string;
}

interface BookFormProps {
  book?: Book;
  onSuccess: () => void;
}

export function BookForm({ book, onSuccess }: BookFormProps) {
  const { addBook, updateBook } = useBooksStore();
  const isEditing = !!book;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      isbn: book?.isbn ?? "",
      description: book?.description ?? "",
      coverUrl: book?.coverUrl ?? "",
    },
  });

  const [createBook, { loading: creating, error: createError }] = useMutation(
    CREATE_BOOK,
    {
      onCompleted: (data) => {
        addBook(data.createBook);
        onSuccess();
      },
    },
  );

  const [updateBookMutation, { loading: updating, error: updateError }] =
    useMutation(UPDATE_BOOK, {
      onCompleted: (data) => {
        updateBook(data.updateBook);
        onSuccess();
      },
    });

  const onSubmit = (data: BookFormData) => {
    const input = {
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      description: data.description || undefined,
      coverUrl: data.coverUrl || undefined,
    };

    if (isEditing) {
      updateBookMutation({ variables: { input: { id: book.id, ...input } } });
    } else {
      createBook({ variables: { input } });
    }
  };

  const error = createError || updateError;
  const loading = creating || updating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorMessage message={error.message} />}

      <Input
        label="Title"
        placeholder="The Great Gatsby"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />
      <Input
        label="Author"
        placeholder="F. Scott Fitzgerald"
        error={errors.author?.message}
        {...register("author", { required: "Author is required" })}
      />
      <Input
        label="ISBN"
        placeholder="9780743273565"
        error={errors.isbn?.message}
        {...register("isbn", { required: "ISBN is required" })}
      />
      <Input
        label="Description (optional)"
        placeholder="A brief description..."
        {...register("description")}
      />
      <Input
        label="Cover URL (optional)"
        placeholder="https://..."
        type="url"
        {...register("coverUrl")}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditing ? "Update Book" : "Add Book"}
        </Button>
      </div>
    </form>
  );
}
