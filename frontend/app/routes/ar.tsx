import type { Route } from "./+types/ar";
import Ar from "~/pages/ar/ar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MeowlPlace" },
    { name: "description", content: "Welcome to MeowPlace! I love meowlplace" },
  ];
}

export default function DrawRoute() {
  return (
    <>
      <Ar />
    </>
  );
}
