"use client";

import { incrementLikeCount, incrementVisitCount } from "@/actions/count";
import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useTransition,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type HeroStatsContextValue = {
  likeCount: number;
  visitCount: number;
  isPending: boolean;
  like: () => void;
};

const HeroStatsContext = createContext<HeroStatsContextValue | null>(null);

function useHeroStats() {
  const context = useContext(HeroStatsContext);
  if (!context) {
    throw new Error("useHeroStats must be used within a HeroStatsProvider");
  }
  return context;
}

export function HeroStatsProvider({
  initialLikeCount,
  initialVisitCount,
  children,
}: {
  initialLikeCount: number;
  initialVisitCount: number;
  children: ReactNode;
}) {
  const [likeCount, setOptimisticLikeCount] = useOptimistic(
    initialLikeCount,
    (_current: number, optimisticValue: number) => optimisticValue
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    incrementVisitCount();
  }, []);

  const like = () => {
    startTransition(async () => {
      setOptimisticLikeCount(likeCount + 1);
      toast.promise(incrementLikeCount(), {
        loading: "Incrementing...",
        success: "Thanks for the wave!",
        error: "Rate limit exceeded. Retry again soon.",
      });
    });
  };

  return (
    <HeroStatsContext.Provider
      value={{ likeCount, visitCount: initialVisitCount, isPending, like }}
    >
      {children}
    </HeroStatsContext.Provider>
  );
}

export function LikeBadge() {
  const { isPending, like } = useHeroStats();

  return (
    <button
      type="button"
      aria-label="Send a wave"
      onClick={like}
      className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border bg-background text-lg shadow-md ring-2 ring-background transition-transform hover:scale-110 active:scale-90"
    >
      {isPending ? "🙌" : "👋"}
    </button>
  );
}

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function VisitLikeCounter() {
  const { likeCount, visitCount } = useHeroStats();

  return (
    <p className="text-sm text-muted-foreground">
      total_visits = {formatCompact(visitCount)} | likes ={" "}
      {formatCompact(likeCount)}
    </p>
  );
}
