import type { Route } from "./+types/ar";
import Ar from "~/pages/ar/ar";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Meowlytics" }, { name: "description", content: "Welcome to Meowlytics!" }];
}

export default function DrawRoute() {
  return (
    <>
      <Ar />
    </>
  );
}
