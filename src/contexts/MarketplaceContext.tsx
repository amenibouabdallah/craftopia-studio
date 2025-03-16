
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Design } from "./DesignContext";

export interface MarketplaceItem {
  id: string;
  designId: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  purchasesCount: number;
  featured: boolean;
}

export type MarketplaceCategory = "all" | "templates" | "social media" | "presentations" | "business" | "print" | "other";

interface MarketplaceContextType {
  marketplaceItems: MarketplaceItem[];
  featuredItems: MarketplaceItem[];
  userListings: MarketplaceItem[];
  userPurchases: MarketplaceItem[];
  categories: MarketplaceCategory[];
  publishDesign: (design: Design, details: Omit<MarketplaceItem, "id" | "designId" | "sellerId" | "sellerName" | "createdAt" | "updatedAt" | "purchasesCount">) => void;
  purchaseDesign: (itemId: string) => void;
  removeFromMarketplace: (itemId: string) => void;
  updateListing: (itemId: string, updates: Partial<MarketplaceItem>) => void;
  getMarketplaceItemsByCategory: (category: MarketplaceCategory) => MarketplaceItem[];
  searchMarketplace: (query: string) => MarketplaceItem[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

interface MarketplaceProviderProps {
  children: ReactNode;
}

// Sample marketplace items
const sampleMarketplaceItems: MarketplaceItem[] = [
  {
    id: "item-1",
    designId: "template-1",
    sellerId: "user-1",
    sellerName: "Designer Studio",
    title: "Modern Social Media Template",
    description: "Perfect for Instagram and Facebook posts. Clean and modern design with customizable elements.",
    price: 9.99,
    category: "social media",
    tags: ["social media", "instagram", "facebook", "modern"],
    thumbnail: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    purchasesCount: 245,
    featured: true,
  },
  {
    id: "item-2",
    designId: "template-2",
    sellerId: "user-2",
    sellerName: "Creative Minds",
    title: "Business Presentation Pack",
    description: "Professional presentation templates for business proposals, reports, and pitches.",
    price: 19.99,
    category: "presentations",
    tags: ["presentation", "business", "corporate", "professional"],
    thumbnail: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    purchasesCount: 187,
    featured: true,
  },
  {
    id: "item-3",
    designId: "template-3",
    sellerId: "user-3",
    sellerName: "Design Masters",
    title: "Premium Business Card Templates",
    description: "Stand out with these unique business card designs. Easy to customize and print-ready.",
    price: 5.99,
    category: "business",
    tags: ["business card", "print", "branding"],
    thumbnail: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    purchasesCount: 312,
    featured: false,
  },
];

export const MarketplaceProvider = ({ children }: MarketplaceProviderProps) => {
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(sampleMarketplaceItems);
  const [userListings, setUserListings] = useState<MarketplaceItem[]>([]);
  const [userPurchases, setUserPurchases] = useState<MarketplaceItem[]>([]);
  
  const categories: MarketplaceCategory[] = ["all", "templates", "social media", "presentations", "business", "print", "other"];
  
  // Get featured items (top 5 items with featured flag)
  const featuredItems = marketplaceItems
    .filter(item => item.featured)
    .sort((a, b) => b.purchasesCount - a.purchasesCount)
    .slice(0, 5);
  
  // Publish a design to the marketplace
  const publishDesign = (
    design: Design, 
    details: Omit<MarketplaceItem, "id" | "designId" | "sellerId" | "sellerName" | "createdAt" | "updatedAt" | "purchasesCount">
  ) => {
    const newItem: MarketplaceItem = {
      id: `item-${Date.now()}`,
      designId: design.id,
      sellerId: "current-user", // In a real app, this would be the current user's ID
      sellerName: "Your Name", // In a real app, this would be the current user's name
      createdAt: new Date(),
      updatedAt: new Date(),
      purchasesCount: 0,
      ...details,
    };
    
    setMarketplaceItems([...marketplaceItems, newItem]);
    setUserListings([...userListings, newItem]);
  };
  
  // Purchase a design
  const purchaseDesign = (itemId: string) => {
    const item = marketplaceItems.find(item => item.id === itemId);
    if (!item) return;
    
    // In a real app, this would handle payment processing
    setUserPurchases([...userPurchases, item]);
    
    // Update purchase count
    setMarketplaceItems(
      marketplaceItems.map(item => 
        item.id === itemId 
          ? { ...item, purchasesCount: item.purchasesCount + 1 }
          : item
      )
    );
  };
  
  // Remove a design from the marketplace
  const removeFromMarketplace = (itemId: string) => {
    setMarketplaceItems(marketplaceItems.filter(item => item.id !== itemId));
    setUserListings(userListings.filter(item => item.id !== itemId));
  };
  
  // Update a marketplace listing
  const updateListing = (itemId: string, updates: Partial<MarketplaceItem>) => {
    setMarketplaceItems(
      marketplaceItems.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      )
    );
    
    setUserListings(
      userListings.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      )
    );
  };
  
  // Get marketplace items by category
  const getMarketplaceItemsByCategory = (category: MarketplaceCategory) => {
    if (category === "all") return marketplaceItems;
    return marketplaceItems.filter(item => item.category === category);
  };
  
  // Search marketplace
  const searchMarketplace = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return marketplaceItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };
  
  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceItems,
        featuredItems,
        userListings,
        userPurchases,
        categories,
        publishDesign,
        purchaseDesign,
        removeFromMarketplace,
        updateListing,
        getMarketplaceItemsByCategory,
        searchMarketplace,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
