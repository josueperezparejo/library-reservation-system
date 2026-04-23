"use client";

import { useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Plus, Pencil, Trash2, Loader2, UserCircle } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { GET_USERS } from "@/lib/graphql/queries/users";
import { DELETE_USER } from "@/lib/graphql/mutations/users";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserForm } from "@/components/users/user-form";

import type { User } from "@/types";

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { data, loading, refetch } = useQuery(GET_USERS);

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => refetch(),
  });

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    deleteUser({ variables: { id: deletingUser.id } }).finally(() => {
      setIsDeleting(false);
      setDeletingUser(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-gray-500">Manage library members</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && (data?.users?.length ?? 0) > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {data.users.length} members
            </span>
          )}
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add User
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
                <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="hidden px-4 py-3 font-semibold text-gray-700 md:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.users?.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingUser(user)}
                        title="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingUser(user)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.users?.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    No users yet
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
        title="Add New User"
      >
        <UserForm
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        {editingUser && (
          <UserForm
            user={editingUser}
            onSuccess={() => {
              setEditingUser(null);
              refetch();
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete user"
        description={`Are you sure you want to delete "${deletingUser?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
