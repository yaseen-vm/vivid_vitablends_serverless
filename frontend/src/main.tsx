import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

try {
  createRoot(root).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = "padding: 20px; color: red;";
  errorDiv.textContent = `Error: ${error}`;
  root.appendChild(errorDiv);
}
