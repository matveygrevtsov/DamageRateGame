import React, { useEffect, useRef } from "react";
import { Root, Canvas } from "./styles";
import { GameController } from "./engine/GameController/GameController";

export const Game = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gameController = new GameController({ canvas });
    gameController.start();
    return () => gameController.unmount();
  }, []);

  return (
    <Root>
      <Canvas ref={ref} />
    </Root>
  );
};
