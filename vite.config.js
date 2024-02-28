import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  // Checked if it's in production mode, if it is, set the base path to /react-todo-list/, if not, set it to /.
  base: process.env.NODE_ENV === "production" ? "/react-todo-list/" : "/",
  plugins: [react()],
})
