import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// import '@swagger-ts/api-client';
import "./styles/global.css";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);