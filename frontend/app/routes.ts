import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("draw/", "./routes/draw.tsx"),
  route("ar/", "./routes/ar.tsx")
] satisfies RouteConfig;
