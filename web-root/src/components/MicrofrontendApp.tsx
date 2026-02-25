import React, { Suspense } from "react";

// Dynamically import the microfrontend app (without Router)
const MicrofrontendApp = React.lazy(() => import("microfrontend/RouterlessApp"));

const MicrofrontendWrapper: React.FC = () => {
  return (
    <div>
      <h2>Microfrontend Content:</h2>
      <Suspense fallback={<div>Loading Microfrontend...</div>}>
        <MicrofrontendApp />
      </Suspense>
    </div>
  );
};

export default MicrofrontendWrapper;
