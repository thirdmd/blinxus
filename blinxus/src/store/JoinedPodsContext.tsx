import React, { createContext, useContext, useState, ReactNode } from 'react';

interface JoinedPod {
  podId: string;
  joinedAt: string; // ISO timestamp when the pod was joined
  notificationsEnabled: boolean;
}

interface JoinedPodsContextType {
  joinedPodIds: string[];
  joinedPods: JoinedPod[];
  joinPod: (podId: string) => void;
  leavePod: (podId: string) => void;
  isPodJoined: (podId: string) => boolean;
  togglePodNotifications: (podId: string) => void;
  isPodNotificationsEnabled: (podId: string) => boolean;
}

const JoinedPodsContext = createContext<JoinedPodsContextType | undefined>(undefined);

export const JoinedPodsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [joinedPods, setJoinedPods] = useState<JoinedPod[]>([]);
  
  // Keep joinedPodIds for backward compatibility
  const joinedPodIds = joinedPods.map(joined => joined.podId);

  const joinPod = (podId: string) => {
    setJoinedPods(prev => {
      if (!prev.some(joined => joined.podId === podId)) {
        return [...prev, { 
          podId, 
          joinedAt: new Date().toISOString(),
          notificationsEnabled: true // Default to notifications enabled
        }];
      }
      return prev;
    });
  };

  const leavePod = (podId: string) => {
    setJoinedPods(prev => prev.filter(joined => joined.podId !== podId));
  };

  const isPodJoined = (podId: string) => {
    return joinedPods.some(joined => joined.podId === podId);
  };

  const togglePodNotifications = (podId: string) => {
    setJoinedPods(prev => 
      prev.map(joined => 
        joined.podId === podId 
          ? { ...joined, notificationsEnabled: !joined.notificationsEnabled }
          : joined
      )
    );
  };

  const isPodNotificationsEnabled = (podId: string) => {
    const pod = joinedPods.find(joined => joined.podId === podId);
    return pod?.notificationsEnabled ?? true;
  };

  return (
    <JoinedPodsContext.Provider value={{ 
      joinedPodIds, 
      joinedPods, 
      joinPod, 
      leavePod, 
      isPodJoined, 
      togglePodNotifications,
      isPodNotificationsEnabled 
    }}>
      {children}
    </JoinedPodsContext.Provider>
  );
};

export const useJoinedPods = () => {
  const context = useContext(JoinedPodsContext);
  if (context === undefined) {
    throw new Error('useJoinedPods must be used within a JoinedPodsProvider');
  }
  return context;
}; 