'use client';

import { useEffect } from 'react';
import { useQuestStore } from '@/lib/store';
import { X, Zap, Coins, Shield, Flame, Info, AlertTriangle } from 'lucide-react';

const TOAST_ICONS: Record<string, React.ReactNode> = {
  xp: <Zap className="w-4 h-4 text-xp" />,
  gold: <Coins className="w-4 h-4 text-gold" />,
  shield: <Shield className="w-4 h-4 text-accent" />,
  streak: <Flame className="w-4 h-4 text-ember" />,
  info: <Info className="w-4 h-4 text-muted" />,
  warning: <AlertTriangle className="w-4 h-4 text-hard" />,
};

export default function ToastContainer() {
  const toasts = useQuestStore((s) => s.toasts);
  const dismissToast = useQuestStore((s) => s.dismissToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} type={toast.type} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: string;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3500);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className="pointer-events-auto animate-[toast-in_0.4s_cubic-bezier(0.22,1,0.36,1)] bg-card border border-border-glow rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg shadow-black/30">
      <span className="shrink-0">{TOAST_ICONS[type] ?? TOAST_ICONS.info}</span>
      <span className="text-sm text-foreground flex-1 font-medium">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 text-muted hover:text-foreground transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
