import React from 'react';
import { createRoot } from 'react-dom/client';

import "./styles/global.css";

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#1a202c', marginBottom: '20px' }}>🚀 Microfrontend Module Provider</h1>
      <p style={{ color: '#4a5568', fontSize: '1.2em', marginBottom: '30px' }}>This microfrontend is running in standalone mode.</p>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Available Module Exports:</h2>
        <ul style={{ textAlign: 'left', color: '#4a5568', lineHeight: '1.8' }}>
          <li><strong>./App</strong> - Full application</li>
        </ul>
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#edf2f7', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>Module Federation Info:</h3>
          <p style={{ color: '#4a5568', fontSize: '0.9em', margin: 0 }}>Remote Entry: <code>remoteEntry.js</code></p>
          <p style={{ color: '#4a5568', fontSize: '0.9em', margin: '5px 0 0 0' }}>Federation Name: <code>microfrontend</code></p>
        </div>
      </div>
      <p style={{ color: '#718096', marginTop: '20px', fontSize: '0.9em' }}>
        To use this microfrontend, import it in your host application.
      </p>
    </div>
  );
}