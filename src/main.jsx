import "./css-reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import TheMovieDBAPIProvider from "./context/TheMovieDBAPI/index.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TheMovieDBAPIProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TheMovieDBAPIProvider>
  </StrictMode>,
);
