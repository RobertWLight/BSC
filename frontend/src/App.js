import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import MarketingHub from "./components/MarketingHub";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/marketing" element={<MarketingHub />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



