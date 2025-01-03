import React from "react";
import { Game } from "./components/Game/Game";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders";

export const App = () => {
  return <Game />;
};
