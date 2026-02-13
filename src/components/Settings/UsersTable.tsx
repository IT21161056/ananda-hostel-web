import { FC, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react";

import { UserResponse } from "../../api/user/types";

interface Props {
  data?: UserResponse[];
  refetch: () => void;
  loading?: boolean;
  onEditUser?: (user: UserResponse) => void;
  onToggleStatus?: (user: UserResponse) => void;
  onDeleteUser?: (user: UserResponse) => void;
}

const UsersTable: FC<Props> = ({
  data = [],
  loading = false,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 25, 50, 100];

  // Calculate pagination
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = data?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Helper: get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-600 text-white";
      case "warden":
        return "bg-blue-600 text-white";
      case "lecturer":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Helper: get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "warden":
        return "Warden";
      case "lecturer":
        return "Lecturer";
      default:
        return "User";
    }
  };

  const handleEditUser = (user: UserResponse) => {
    onEditUser?.(user);
  };

  const handleToggleStatus = (user: UserResponse) => {
    onToggleStatus?.(user);
  };

  const handleDeleteUser = (user: UserResponse) => {
    onDeleteUser?.(user);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden relative mt-6">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">
              Loading users...
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  User Name
                  <svg
                    className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  Email
                  <svg
                    className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left">
                <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  Role
                  <svg
                    className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  Created At
                  <svg
                    className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  Updated At
                  <svg
                    className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <>
                {/* Loading skeleton rows */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`loading-${index}`} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user: UserResponse) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                          user.role === "admin"
                            ? "bg-red-600"
                            : user.role === "warden"
                              ? "bg-blue-600"
                              : user.role === "lecturer"
                                ? "bg-green-600"
                                : "bg-gray-600"
                        }`}
                      >
                        <span className="text-sm font-medium text-white">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive !== false
                          ? "bg-green-100 text-green-800 border border-green-600/30"
                          : "bg-red-100 text-red-800 border border-red-600/30"
                      }`}
                    >
                      {user.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.role,
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded transition-colors duration-150"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-1.5 rounded transition-colors duration-150 ${
                          user.isActive !== false
                            ? "text-amber-600 hover:text-amber-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                        title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                      >
                        {user.isActive !== false ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800 p-1.5 rounded transition-colors duration-150"
                        title="Permanently Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              disabled={loading}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">Per page</span>

            <div className="hidden sm:block text-sm text-gray-700">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, data?.length || 0)}
                  </span>
                  of <span className="font-medium">{data?.length || 0}</span>{" "}
                  results
                </>
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>First</span>
                <span>Last</span>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center mx-2">
                  <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded">
                    {currentPage}
                  </span>
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
