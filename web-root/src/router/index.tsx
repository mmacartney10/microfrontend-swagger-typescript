import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import Navbar from "../components/Navbar";
import MicrofrontendLoader from "../components/MicrofrontendLoader";

function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About msg="React" />} />
        <Route
          path="/microfrontend/*"
          element={<MicrofrontendLoader name="microfrontend" />}
        />
        <Route
          path="/microfrontend2/*"
          element={<MicrofrontendLoader name="microfrontend2" />}
        />
        <Route
          path="/microfrontend3/*"
          element={<MicrofrontendLoader name="microfrontend3" />}
        />
        <Route
          path="/microfrontend4/*"
          element={<MicrofrontendLoader name="microfrontend4" />}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
