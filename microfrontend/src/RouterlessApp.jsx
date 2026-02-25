import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';

// This component is for use as a microfrontend (without Router wrapper)
const RouterlessApp = () => {
  const location = useLocation();
  const basePath = '/microfrontend';
  
  return (
    <div>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
        <h3>Microfrontend Navigation</h3>
        <Link to={basePath} style={{ marginRight: '10px' }}>Home</Link>
        <Link to={`${basePath}/about`}>About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About msg="React from Microfrontend" />} />
      </Routes>
    </div>
  );
};

export default RouterlessApp;