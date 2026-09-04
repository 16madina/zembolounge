import { useCallback, useEffect, useRef, useState } from "react";
import type { SlamDuration } from "@/lib/zembo-sounds";

/**
 * Aperçu SIMULÉ (aucun vrai son) : une seule lecture à la fois,
 * barre de progression qui avance sur la durée réelle du morceau.
 */
export function useSoundPreview() {
  const [id, setId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const durRef = useRef(60);

  useEffect(() => {
    if (!playing || !id) return;
    const t = setInterval(() => {
      setElapsed((e) => {
        const next = e + 0.15;
        if (next >= durRef.current) {
          setPlaying(false);
          setId(null);
          return 0;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(t);
  }, [playing, id]);

  const toggle = useCallback(
    (soundId: string, duration: SlamDuration) => {
      navigator.vibrate?.(15);
      if (id === soundId) {
        setPlaying((p) => !p);
        return;
      }
      durRef.current = duration === 1 ? 60 : 180;
      setId(soundId);
      setElapsed(0);
      setPlaying(true);
    },
    [id],
  );

  const stop = useCallback(() => {
    setPlaying(false);
    setId(null);
    setElapsed(0);
  }, []);

  const progress = id ? Math.min(1, elapsed / durRef.current) : 0;

  return { id, playing, progress, elapsed, toggle, stop };
}
