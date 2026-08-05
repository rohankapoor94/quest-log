'use client';

import { useState } from 'react';
import { useQuestStore } from '@/lib/store';
import { ShoppingBag, Plus, Coins, X, Trash2, Gift } from 'lucide-react';

export default function LootShop() {
  const rewards = useQuestStore((s) => s.rewards);
  const gold = useQuestStore((s) => s.gold);
  const addReward = useQuestStore((s) => s.addReward);
  const claimReward = useQuestStore((s) => s.claimReward);
  const deleteReward = useQuestStore((s) => s.deleteReward);

  const [showModal, setShowModal] = useState(false);
  const [rewardName, setRewardName] = useState('');
  const [rewardCost, setRewardCost] = useState('');
  const [rewardEmoji, setRewardEmoji] = useState('');

  const handleSubmit = () => {
    if (!rewardName.trim() || !rewardCost) return;
    addReward(rewardName.trim(), parseInt(rewardCost, 10), rewardEmoji.trim());
    setRewardName('');
    setRewardCost('');
    setRewardEmoji('');
    setShowModal(false);
  };

  const unclaimed = rewards.filter((r) => !r.claimed);
  const claimed = rewards.filter((r) => r.claimed);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gold" />
          Loot Drop Shop
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20 text-sm font-medium hover:bg-gold/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Reward
        </button>
      </div>

      {/* Available rewards */}
      {unclaimed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {unclaimed.map((reward) => {
            const canAfford = gold >= reward.cost;
            return (
              <div
                key={reward.id}
                className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border bg-background/30 hover:border-border-glow transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{reward.emoji}</span>
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="text-muted-dim hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    aria-label="Remove reward"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm text-foreground font-medium leading-snug">{reward.title}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-gold" />
                    <span className="text-sm font-mono font-semibold text-gold">{reward.cost}</span>
                  </div>
                  <button
                    onClick={() => claimReward(reward.id)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 hover:shadow-[0_0_12px_rgba(255,215,0,0.15)]'
                        : 'bg-border/30 text-muted-dim border border-border cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Claim' : `Need ${reward.cost - gold} more`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : claimed.length === 0 ? (
        <div className="text-center py-10 animate-[fade-in_0.3s_ease-out]">
          <div className="text-4xl mb-3">🏪</div>
          <p className="text-foreground font-medium">The shop is empty</p>
          <p className="text-sm text-muted mt-1">
            Add your own rewards and start spending that hard-earned Gold!
          </p>
        </div>
      ) : null}

      {/* Claimed rewards */}
      {claimed.length > 0 && (
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Gift className="w-3 h-3" />
            Claimed Rewards
          </p>
          <div className="flex flex-wrap gap-2">
            {claimed.map((reward) => (
              <div
                key={reward.id}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-success/10 bg-success/[0.03] text-muted text-sm"
              >
                <span>{reward.emoji}</span>
                <span className="line-through">{reward.title}</span>
                <button
                  onClick={() => deleteReward(reward.id)}
                  className="text-muted-dim hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer ml-1"
                  aria-label="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Add Reward Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out] p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card border border-border-glow rounded-xl w-full max-w-sm p-6 animate-[scale-in_0.2s_ease-out] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold font-[family-name:var(--font-cinzel)] text-foreground">
                New Reward
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mb-5">
              <div>
                <label htmlFor="reward-name" className="block text-sm text-muted mb-1.5">
                  Reward Name
                </label>
                <input
                  id="reward-name"
                  type="text"
                  value={rewardName}
                  onChange={(e) => setRewardName(e.target.value)}
                  placeholder="e.g., Guilt-free movie night"
                  maxLength={80}
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-dim text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reward-cost" className="block text-sm text-muted mb-1.5">
                    Gold Cost
                  </label>
                  <input
                    id="reward-cost"
                    type="number"
                    value={rewardCost}
                    onChange={(e) => setRewardCost(e.target.value)}
                    placeholder="100"
                    min={1}
                    max={99999}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-dim text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reward-emoji" className="block text-sm text-muted mb-1.5">
                    Emoji
                  </label>
                  <input
                    id="reward-emoji"
                    type="text"
                    value={rewardEmoji}
                    onChange={(e) => setRewardEmoji(e.target.value)}
                    placeholder="🎬"
                    maxLength={4}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-dim text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!rewardName.trim() || !rewardCost}
                className="px-4 py-2 rounded-lg bg-gold/15 text-gold border border-gold/25 text-sm font-semibold hover:bg-gold/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Add Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
