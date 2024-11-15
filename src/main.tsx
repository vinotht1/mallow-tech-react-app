import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Providers from "./components/hoc/providers.tsx";
import Toaster from "./components/toaster/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <Toaster />
    <App />
  </Providers>
);
