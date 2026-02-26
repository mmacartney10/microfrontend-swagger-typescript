import React from "react";
import Navigation from "./components/Navigation";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <div>
      <Navigation />
      <div style={{ padding: "0 20px" }}>
        <AppRouter />
      </div>
    </div>
  );
};

export default App;
