
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Design, DesignElement } from "./DesignContext";

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
  online: boolean;
  lastActive: Date;
  cursor?: { x: number, y: number };
}

export interface Comment {
  id: string;
  designId: string;
  elementId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies: Comment[];
}

export interface DesignVersion {
  id: string;
  designId: string;
  name: string;
  snapshot: Design;
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

export interface CollaborationSession {
  id: string;
  designId: string;
  activeUsers: Collaborator[];
  startedAt: Date;
  lastActivity: Date;
}

interface CollaborationContextType {
  collaborators: Collaborator[];
  comments: Comment[];
  versions: DesignVersion[];
  activeSession: CollaborationSession | null;
  addCollaborator: (designId: string, email: string, role: Collaborator["role"]) => void;
  removeCollaborator: (designId: string, userId: string) => void;
  updateCollaboratorRole: (designId: string, userId: string, role: Collaborator["role"]) => void;
  addComment: (designId: string, content: string, elementId?: string) => void;
  resolveComment: (commentId: string) => void;
  replyToComment: (commentId: string, content: string) => void;
  createVersion: (design: Design, name: string, notes?: string) => void;
  restoreVersion: (versionId: string) => Design | null;
  updateCursorPosition: (userId: string, x: number, y: number) => void;
  joinSession: (designId: string) => void;
  leaveSession: () => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error("useCollaboration must be used within a CollaborationProvider");
  }
  return context;
};

interface CollaborationProviderProps {
  children: ReactNode;
}

// Sample collaborators
const sampleCollaborators: Collaborator[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "owner",
    online: true,
    lastActive: new Date(),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "editor",
    online: false,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "viewer",
    online: false,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

export const CollaborationProvider = ({ children }: CollaborationProviderProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(sampleCollaborators);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<DesignVersion[]>([]);
  const [activeSession, setActiveSession] = useState<CollaborationSession | null>(null);
  
  // Add a collaborator to a design
  const addCollaborator = (designId: string, email: string, role: Collaborator["role"]) => {
    const newCollaborator: Collaborator = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0], // Temporary name from email
      email,
      role,
      online: false,
      lastActive: new Date(),
    };
    
    setCollaborators([...collaborators, newCollaborator]);
  };
  
  // Remove a collaborator from a design
  const removeCollaborator = (designId: string, userId: string) => {
    setCollaborators(collaborators.filter(collaborator => collaborator.id !== userId));
  };
  
  // Update a collaborator's role
  const updateCollaboratorRole = (designId: string, userId: string, role: Collaborator["role"]) => {
    setCollaborators(
      collaborators.map(collaborator => 
        collaborator.id === userId 
          ? { ...collaborator, role }
          : collaborator
      )
    );
  };
  
  // Add a comment to a design
  const addComment = (designId: string, content: string, elementId?: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      designId,
      elementId,
      authorId: "current-user", // In a real app, this would be the current user's ID
      authorName: "You", // In a real app, this would be the current user's name
      content,
      timestamp: new Date(),
      resolved: false,
      replies: [],
    };
    
    setComments([...comments, newComment]);
  };
  
  // Resolve a comment
  const resolveComment = (commentId: string) => {
    setComments(
      comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, resolved: true }
          : comment
      )
    );
  };
  
  // Reply to a comment
  const replyToComment = (commentId: string, content: string) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          const reply: Comment = {
            id: `reply-${Date.now()}`,
            designId: comment.designId,
            elementId: comment.elementId,
            authorId: "current-user", // In a real app, this would be the current user's ID
            authorName: "You", // In a real app, this would be the current user's name
            content,
            timestamp: new Date(),
            resolved: false,
            replies: [],
          };
          
          return {
            ...comment,
            replies: [...comment.replies, reply],
          };
        }
        return comment;
      })
    );
  };
  
  // Create a version of a design
  const createVersion = (design: Design, name: string, notes?: string) => {
    const newVersion: DesignVersion = {
      id: `version-${Date.now()}`,
      designId: design.id,
      name,
      snapshot: { ...design },
      createdBy: "current-user", // In a real app, this would be the current user's ID
      createdAt: new Date(),
      notes,
    };
    
    setVersions([...versions, newVersion]);
  };
  
  // Restore a version of a design
  const restoreVersion = (versionId: string) => {
    const version = versions.find(version => version.id === versionId);
    if (!version) return null;
    
    return { ...version.snapshot };
  };
  
  // Update cursor position
  const updateCursorPosition = (userId: string, x: number, y: number) => {
    setCollaborators(
      collaborators.map(collaborator => 
        collaborator.id === userId 
          ? { ...collaborator, cursor: { x, y } }
          : collaborator
      )
    );
  };
  
  // Join a collaboration session
  const joinSession = (designId: string) => {
    // Check if session already exists
    if (activeSession && activeSession.designId === designId) {
      // Update existing session
      setActiveSession({
        ...activeSession,
        lastActivity: new Date(),
      });
      return;
    }
    
    // Create new session
    const newSession: CollaborationSession = {
      id: `session-${Date.now()}`,
      designId,
      activeUsers: [
        {
          id: "current-user", // In a real app, this would be the current user's ID
          name: "You", // In a real app, this would be the current user's name
          email: "you@example.com", // In a real app, this would be the current user's email
          role: "owner", // In a real app, this would be the user's actual role
          online: true,
          lastActive: new Date(),
        },
      ],
      startedAt: new Date(),
      lastActivity: new Date(),
    };
    
    setActiveSession(newSession);
  };
  
  // Leave a collaboration session
  const leaveSession = () => {
    setActiveSession(null);
  };
  
  return (
    <CollaborationContext.Provider
      value={{
        collaborators,
        comments,
        versions,
        activeSession,
        addCollaborator,
        removeCollaborator,
        updateCollaboratorRole,
        addComment,
        resolveComment,
        replyToComment,
        createVersion,
        restoreVersion,
        updateCursorPosition,
        joinSession,
        leaveSession,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};
