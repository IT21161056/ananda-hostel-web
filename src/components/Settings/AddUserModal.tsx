import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { User as UserType } from "./types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createValidationSchema, UserRegistration } from "./yup";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import { useSignup } from "../../api/auth";
import { useUpdateUser } from "../../api/user";
import { toast } from "react-toastify";
import { CreateUserBody } from "../../api/auth/types";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserType, "id"> & { password?: string }) => void;
  editUser?: UserType;
  refetch: () => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  editUser,
  refetch,
}: AddUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditMode = !!editUser;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserRegistration>({
    resolver: yupResolver(createValidationSchema(isEditMode)) as any, // Type assertion to fix the resolver type issue
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      nic: "",
      phone: "",
      role: "", // Empty string for initial state
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const roles = [
    { value: "", label: "Select a role" }, // Add this as first option
    { value: "admin", label: "Administrator" },
    { value: "warden", label: "Warden" },
    { value: "lecturer", label: "Lecturer" },
  ];

  // Reset form when modal opens/closes or editUser changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editUser) {
        reset({
          firstName: editUser.firstName || "",
          lastName: editUser.lastName || "",
          email: editUser.email || "",
          nic: editUser.nic || "",
          phone: editUser.phone || "",
          role: editUser.role || "",
          password: "",
          confirmPassword: "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          nic: "",
          phone: "",
          role: "", // Empty string to force user selection
          password: "",
          confirmPassword: "",
        });
      }
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, isEditMode, editUser, reset]);

  const { mutate: Signup, isPending: isPendingSignup } = useSignup({
    onSuccess() {
      onClose();
      refetch();
      toast.success("User created successfully");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "User creation failed");
    },
  });

  const { mutate: updateUser, isPending: isPendingUpdate } = useUpdateUser({
    id: editUser?.id || "",
    onSuccess() {
      onClose();
      refetch();
      toast.success("User updated successfully");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "User update failed");
    },
  });

  const onSubmit = (formData: UserRegistration) => {
    if (isEditMode && editUser?.id) {
      // Update user - only send password if provided
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        nic: formData.nic,
        phone: formData.phone,
        role: formData.role,
      };

      // Only include password if it was provided
      if (formData.password && formData.password.length > 0) {
        updateData.password = formData.password;
      }

      updateUser(updateData);
    } else {
      if (formData.password && formData.password.length > 0) {
        formData.password = formData.password as string;
      }
      // Create new user
      Signup(formData as CreateUserBody);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const isPending = isPendingSignup || isPendingUpdate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Icon icon="mdi:close" className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Icon
                icon="mdi:account-circle"
                className="h-5 w-5 mr-2 text-blue-600"
              />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <Input
                      label="First Name"
                      {...field}
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <Input
                      label="Last Name"
                      {...field}
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      label="Email Address"
                      {...field}
                      error={errors.email?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="nic"
                  render={({ field }) => (
                    <Input label="NIC" {...field} error={errors.nic?.message} />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      label="Phone"
                      {...field}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Icon
                icon="mdi:shield-account"
                className="h-5 w-5 mr-2 text-purple-600"
              />
              Role
            </h3>
            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Role"
                    options={roles}
                    error={errors.role?.message}
                    placeholder="Select a role"
                  />
                )}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Icon icon="mdi:lock" className="h-5 w-5 mr-2 text-green-600" />
              Security
            </h3>
            {isEditMode && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg flex items-start">
                <Icon
                  icon="mdi:information"
                  className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"
                />
                <span>
                  Leave password fields empty to keep the current password.
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      label="Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      required={!isEditMode}
                      placeholder={
                        isEditMode
                          ? "Leave empty to keep current"
                          : "Enter password"
                      }
                      error={errors.password?.message}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <Icon icon="mdi:eye-off" className="h-4 w-4" />
                          ) : (
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>

              <div className="relative">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <Input
                      label="Confirm Password"
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      required={!isEditMode && !!password}
                      placeholder={
                        isEditMode
                          ? "Leave empty to keep current"
                          : "Confirm password"
                      }
                      error={errors.confirmPassword?.message}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <Icon icon="mdi:eye-off" className="h-4 w-4" />
                          ) : (
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>
            </div>

            {!isEditMode && (
              <div className="text-sm text-gray-500 flex items-start">
                <Icon
                  icon="mdi:shield-key"
                  className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5"
                />
                <span>
                  Password must be at least 8 characters long and include
                  uppercase, lowercase, number, and special character
                  (@$!%*?&#).
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:content-save" className="h-4 w-4 mr-2" />
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
