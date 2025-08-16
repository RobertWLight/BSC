import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import ApplicationWizard from "./components/ApplicationWizard";
import Dashboard from "./components/Dashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

function App() {
  const [businessOwnerId, setBusinessOwnerId] = useState(
    localStorage.getItem('businessOwnerId')
  );

  useEffect(() => {
    if (businessOwnerId) {
      localStorage.setItem('businessOwnerId', businessOwnerId);
    }
  }, [businessOwnerId]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              businessOwnerId ? 
              <Dashboard businessOwnerId={businessOwnerId} setBusinessOwnerId={setBusinessOwnerId} /> : 
              <LandingPage />
            } 
          />
          <Route 
            path="/apply" 
            element={
              <ApplicationWizard 
                businessOwnerId={businessOwnerId}
                setBusinessOwnerId={setBusinessOwnerId}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              businessOwnerId ? 
              <Dashboard businessOwnerId={businessOwnerId} setBusinessOwnerId={setBusinessOwnerId} /> :
              <LandingPage />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;