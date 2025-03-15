import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

console.log("🔧 Amplify configuration:", outputs); // Debugging log
Amplify.configure(outputs);
console.log("✅ Amplify configured successfully"); // Should print before App runs


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
