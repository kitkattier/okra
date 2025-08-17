import NavBar from "~/components/navBar";
import type { Route } from "./+types/home";
import Home from "~/pages/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MeowlPlace" },
    { name: "description", content: "Welcome to MeowPlace! I love meowlplace" },
  ];
}

export default function HomeRoute() {
  return (
    <>
      <Home />
    </>
  );
}
