import type { Route } from "./+types/home";
import Draw from "~/pages/draw/draw";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Meowlytics" }, { name: "description", content: "Welcome to Meowlytics!" }];
}

export default function DrawRoute() {
  return (
    <>
      <Draw />
    </>
  );
}
