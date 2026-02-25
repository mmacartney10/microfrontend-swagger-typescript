import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import Navbar from "../components/Navbar";
import MicrofrontendApp from "../components/MicrofrontendApp";

function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About msg="React" />} />
        <Route
          path="/microfrontend/*"
          element={<MicrofrontendApp app="microfrontend" />}
        />
        <Route
          path="/microfrontend2/*"
          element={<MicrofrontendApp app="microfrontend2" />}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
