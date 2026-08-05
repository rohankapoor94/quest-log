'use client';

import { useEffect } from 'react';
import { useQuestStore } from '@/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useQuestStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
