import React from "react";
import ReactDOM from "react-dom/client";
import CropRecommendation from "./components/CropRecommendation";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CropRecommendation />
  </React.StrictMode>
);
