import { createContext, useContext, useState, ReactNode } from 'react';
import type { InvestmentProfile } from '@/types';

interface ProfileContextType {
  selectedProfile: InvestmentProfile | null;
  setSelectedProfile: (profile: InvestmentProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [selectedProfile, setSelectedProfile] = useState<InvestmentProfile | null>(null);

  return (
    <ProfileContext.Provider value={{ selectedProfile, setSelectedProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}