import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Shield } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AddUserModal from "./AddUserModal";
import UserConfirmModal, { ConfirmAction } from "./UserConfirmModal";
import UsersTable from "./UsersTable";
import { User } from "./types";
import { useGetAllUsers, useDeleteUser, useToggleUserStatus } from "../../api/user";
import { UserResponse } from "../../api/user/types";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import { toast } from "react-toastify";

const roles = [
  { label: "All users", value: "" },
  { label: "Administrator", value: "admin" },
  { label: "Warden", value: "warden" },
  { label: "Accountant", value: "accountant" },
  { label: "Kitchen Staff", value: "kitchen staff" },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [role, setRole] = useState(roles[0].value);
  const [confirmModal, setConfirmModal] = useState<{
    user: UserResponse;
    action: ConfirmAction;
  } | null>(null);

  const { hasPermission } = useAuth();

  // Memoize the params to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      search: searchTerm || undefined,
      role: role || undefined,
    }),
    [searchTerm, role]
  );

  const {
    data: userData,
    isLoading,
    refetch: refetchUsers,
  } = useGetAllUsers(queryParams);

  // Reset to first page when filters change
  useEffect(() => {
    // This effect can be used for future pagination reset logic
  }, [searchTerm, role]);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser({
    onSuccess() {
      toast.success("User deleted successfully");
      refetchUsers();
      setConfirmModal(null);
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });

  const { mutate: toggleUserStatus, isPending: isToggling } = useToggleUserStatus({
    onSuccess() {
      toast.success("User status updated successfully");
      refetchUsers();
      setConfirmModal(null);
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Failed to update user status");
    },
  });

  const handleToggleStatus = (user: UserResponse) => {
    setConfirmModal({ user, action: "toggleStatus" });
  };

  const handleDeleteUser = (user: UserResponse) => {
    setConfirmModal({ user, action: "permanentDelete" });
  };

  const handleConfirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.action === "toggleStatus") {
      toggleUserStatus(confirmModal.user._id);
    } else {
      deleteUser(confirmModal.user._id);
    }
  };

  // Convert UserResponse to User type for editing
  const convertUserResponseToUser = (userResponse: UserResponse): User => {
    return {
      id: userResponse._id,
      firstName: userResponse.firstName,
      lastName: userResponse.lastName,
      email: userResponse.email,
      nic: userResponse.nic,
      phone: userResponse.phone,
      role: userResponse.role as "admin" | "warden" | "lecturer",
    };
  };

  const openEditModal = (userResponse: UserResponse) => {
    const user = convertUserResponseToUser(userResponse);
    setEditingUser(user);
    setIsAddModalOpen(true);
  };

  const handleAddUser = () => {
    // This is handled by AddUserModal internally
  };

  const handleEditUser = () => {
    // This is handled by AddUserModal internally
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUser(undefined);
  };

  if (!hasPermission("manage_users")) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600">
            Only administrators can manage user accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system users and their permissions
          </p> */}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select
            options={roles}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <UsersTable
        data={userData?.data}
        refetch={refetchUsers}
        loading={isLoading || isDeleting || isToggling}
        onEditUser={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
      />

      {/* Confirmation Modal */}
      <UserConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={handleConfirmAction}
        user={confirmModal?.user ?? null}
        action={confirmModal?.action ?? "toggleStatus"}
        isPending={isDeleting || isToggling}
      />

      {/* Add/Edit User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={editingUser ? handleEditUser : handleAddUser}
        editUser={editingUser}
        refetch={refetchUsers}
      />
    </div>
  );
}
