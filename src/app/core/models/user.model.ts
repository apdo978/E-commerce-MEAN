export interface UserType {
  _id: string;
  name: string;
}

export interface User {
  iat: number; 
  _id?: string;
  name: string;
  email: string;
  userType: string | UserType;  // Can be either the ID (string) or the full UserType object
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  avatar: string;
} 