import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource-variable/red-hat-mono"
import "@fontsource-variable/jetbrains-mono"
import "@fontsource-variable/noto-sans-arabic"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
