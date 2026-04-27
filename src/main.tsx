import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import BlogList from "./components/BlogList.tsx";
import BlogPost from "./components/BlogPost.tsx";
import ComparePage from "./components/ComparePage.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/compare/:slug" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
