import { useEffect, useRef } from "react";
import { GameController } from "./GameController";

export const useGame = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gameController = new GameController({ canvas });
    gameController.start();
    return () => gameController.unmount();
  }, []);

  return ref;
};
