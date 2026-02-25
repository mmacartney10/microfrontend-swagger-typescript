import React from "react";
import AppRouter from "./router";
import QueryProvider from "./providers/QueryProvider";

const App = () => {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
