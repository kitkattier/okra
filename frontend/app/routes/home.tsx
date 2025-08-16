import NavBar from "~/components/navBar";
import type { Route } from "./+types/home";
import Home from "~/pages/home/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Meowlytics" }, { name: "description", content: "Welcome to Meowlytics!" }];
}

export default function HomeRoute() {
  return (
    <>
      <Home />
    </>
  );
}
