import React from "react";
import { Root, Canvas } from "./styles";
import { useGame } from "./useGame";

export const Game = () => {
  const ref = useGame();
  return (
    <Root>
      <Canvas ref={ref} />
    </Root>
  );
};
