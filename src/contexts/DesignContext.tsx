
import React, { createContext, useContext, useState, ReactNode } from "react";

export type ElementType = "text" | "shape" | "image" | "line";

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  src?: string;
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  stroke?: string;
  strokeWidth?: number;
  shapeType?: "rect" | "circle" | "ellipse" | "line" | "triangle" | "pentagon" | "hexagon" | "star";
  align?: "left" | "center" | "right";
  points?: number[]; // For line drawings
}

export interface Design {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: DesignElement[];
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

interface DesignContextType {
  currentDesign: Design | null;
  setCurrentDesign: (design: Design | null) => void;
  recentDesigns: Design[];
  addRecentDesign: (design: Design) => void;
  updateElement: (elementId: string, updates: Partial<DesignElement>) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  addElement: (element: Omit<DesignElement, "id">) => void;
  removeElement: (id: string) => void;
  saveDesign: () => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
};

interface DesignProviderProps {
  children: ReactNode;
}

const sampleDesigns: Design[] = [
  {
    id: "template-1",
    name: "Social Media Post",
    width: 1080,
    height: 1080,
    elements: [
      {
        id: "text-1",
        type: "text",
        x: 540,
        y: 540,
        width: 400,
        height: 100,
        rotation: 0,
        content: "Click to edit this text",
        fill: "#333333",
        fontSize: 32,
        fontFamily: "Inter, sans-serif",
      },
    ],
    backgroundColor: "#ffffff",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: "",
  },
  {
    id: "template-2",
    name: "Presentation Slide",
    width: 1920,
    height: 1080,
    elements: [
      {
        id: "text-1",
        type: "text",
        x: 960,
        y: 300,
        width: 800,
        height: 100,
        rotation: 0,
        content: "Presentation Title",
        fill: "#333333",
        fontSize: 48,
        fontFamily: "Inter, sans-serif",
      },
      {
        id: "text-2",
        type: "text",
        x: 960,
        y: 500,
        width: 600,
        height: 100,
        rotation: 0,
        content: "Subtitle here",
        fill: "#666666",
        fontSize: 28,
        fontFamily: "Inter, sans-serif",
      },
    ],
    backgroundColor: "#f5f5f5",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: "",
  },
  {
    id: "template-3",
    name: "Business Card",
    width: 1050,
    height: 600,
    elements: [
      {
        id: "text-1",
        type: "text",
        x: 525,
        y: 200,
        width: 400,
        height: 100,
        rotation: 0,
        content: "Your Name",
        fill: "#333333",
        fontSize: 32,
        fontFamily: "Inter, sans-serif",
      },
      {
        id: "text-2",
        type: "text",
        x: 525,
        y: 300,
        width: 400,
        height: 100,
        rotation: 0,
        content: "Job Title",
        fill: "#666666",
        fontSize: 24,
        fontFamily: "Inter, sans-serif",
      },
    ],
    backgroundColor: "#ffffff",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: "",
  },
];

export const DesignProvider = ({ children }: DesignProviderProps) => {
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [recentDesigns, setRecentDesigns] = useState<Design[]>(sampleDesigns);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const updateElement = (elementId: string, updates: Partial<DesignElement>) => {
    if (!currentDesign) return;

    setCurrentDesign({
      ...currentDesign,
      elements: currentDesign.elements.map((element) =>
        element.id === elementId
          ? { ...element, ...updates }
          : element
      ),
      updatedAt: new Date(),
    });
  };

  const addElement = (element: Omit<DesignElement, "id">) => {
    if (!currentDesign) return;

    const newElement: DesignElement = {
      ...element,
      id: `element-${Date.now()}`,
    };

    setCurrentDesign({
      ...currentDesign,
      elements: [...currentDesign.elements, newElement],
      updatedAt: new Date(),
    });

    setSelectedElement(newElement.id);
  };

  const removeElement = (id: string) => {
    if (!currentDesign) return;

    setCurrentDesign({
      ...currentDesign,
      elements: currentDesign.elements.filter((element) => element.id !== id),
      updatedAt: new Date(),
    });

    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const addRecentDesign = (design: Design) => {
    const existingIndex = recentDesigns.findIndex((d) => d.id === design.id);

    if (existingIndex !== -1) {
      const updatedRecentDesigns = [...recentDesigns];
      updatedRecentDesigns[existingIndex] = design;
      setRecentDesigns(updatedRecentDesigns);
    } else {
      setRecentDesigns([design, ...recentDesigns].slice(0, 10));
    }
  };

  const saveDesign = () => {
    if (!currentDesign) return;
    
    addRecentDesign({
      ...currentDesign,
      updatedAt: new Date(),
    });
    
    console.log("Design saved:", currentDesign);
  };

  return (
    <DesignContext.Provider
      value={{
        currentDesign,
        setCurrentDesign,
        recentDesigns,
        addRecentDesign,
        updateElement,
        selectedElement,
        setSelectedElement,
        addElement,
        removeElement,
        saveDesign,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};
