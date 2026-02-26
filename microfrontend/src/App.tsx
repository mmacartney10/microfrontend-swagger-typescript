import React from "react";
import Navigation from "./components/Navigation";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <div>
      <Navigation />
      <AppRouter />
    </div>
  );
};

export default App;
