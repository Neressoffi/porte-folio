"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BuddySceneContextValue = {
  edgeOrbsVisible: boolean;
  toggleEdgeOrbs: () => void;
};

const BuddySceneContext = createContext<BuddySceneContextValue | null>(null);

export function BuddySceneProvider({ children }: { children: ReactNode }) {
  const [edgeOrbsVisible, setEdgeOrbsVisible] = useState(false);

  const toggleEdgeOrbs = useCallback(() => {
    setEdgeOrbsVisible((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ edgeOrbsVisible, toggleEdgeOrbs }),
    [edgeOrbsVisible, toggleEdgeOrbs],
  );

  return (
    <BuddySceneContext.Provider value={value}>{children}</BuddySceneContext.Provider>
  );
}

export function useBuddyScene() {
  const context = useContext(BuddySceneContext);
  if (!context) {
    throw new Error("useBuddyScene must be used within BuddySceneProvider");
  }
  return context;
}
