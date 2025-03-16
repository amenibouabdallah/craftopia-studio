
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "designer" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    behance?: string;
    dribbble?: string;
  };
  createdAt: Date;
  isVerified: boolean;
  subscription?: "free" | "pro" | "enterprise";
  credits: number;
  earnings: number;
}

interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDesigner: boolean;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  getUser: (userId: string) => User | undefined;
  getAllUsers: () => User[];
  addCredits: (amount: number) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Sample users
const sampleUsers: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    isVerified: true,
    subscription: "enterprise",
    credits: 9999,
    earnings: 0,
  },
  {
    id: "user-2",
    name: "Designer Pro",
    email: "designer@example.com",
    role: "designer",
    avatar: "",
    bio: "Professional graphic designer with 10+ years of experience.",
    website: "https://designerpro.com",
    social: {
      twitter: "designerpro",
      instagram: "designerpro",
      behance: "designerpro",
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    isVerified: true,
    subscription: "pro",
    credits: 500,
    earnings: 1250.75,
  },
  {
    id: "user-3",
    name: "Customer User",
    email: "customer@example.com",
    role: "customer",
    avatar: "",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    isVerified: true,
    subscription: "free",
    credits: 50,
    earnings: 0,
  },
];

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "admin";
  const isDesigner = currentUser?.role === "designer" || currentUser?.role === "admin";
  
  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user with matching email
    const user = users.find(user => user.email === email);
    
    // In a real app, we would check the password
    if (user) {
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };
  
  // Logout
  const logout = () => {
    setCurrentUser(null);
  };
  
  // Register
  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date(),
      isVerified: false,
      credits: 10, // Starting credits
      earnings: 0,
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    
    return true;
  };
  
  // Update user
  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    // Update in users array
    setUsers(
      users.map(user => 
        user.id === currentUser.id 
          ? updatedUser 
          : user
      )
    );
  };
  
  // Get user by ID
  const getUser = (userId: string) => {
    return users.find(user => user.id === userId);
  };
  
  // Get all users
  const getAllUsers = () => {
    // In a real app, only admins would have access to all users
    return users;
  };
  
  // Add credits
  const addCredits = (amount: number) => {
    if (!currentUser) return;
    
    updateUser({
      credits: currentUser.credits + amount,
    });
  };
  
  // Update user role (admin only)
  const updateUserRole = (userId: string, role: UserRole) => {
    if (!isAdmin) return;
    
    setUsers(
      users.map(user => 
        user.id === userId 
          ? { ...user, role } 
          : user
      )
    );
    
    // If updating current user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, role });
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isDesigner,
        users,
        login,
        logout,
        register,
        updateUser,
        getUser,
        getAllUsers,
        addCredits,
        updateUserRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
