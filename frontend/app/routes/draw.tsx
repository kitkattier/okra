import type { Route } from "./+types/draw";
import Draw from "~/pages/draw/draw";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MeowlPlace" },
    { name: "description", content: "Welcome to MeowPlace! I love meowlplace" },
  ];
}

export default function DrawRoute() {
  return (
    <>
      <Draw />
    </>
  );
}
