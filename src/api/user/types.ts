export type UserResponse = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  phone: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  nic?: string;
  phone?: string;
  role?: string;
  password?: string;
  isActive?: boolean;
};

export type GetAllUsersPaginated = {
  total: number;
  data: UserResponse[];
};
