import React, { Suspense } from "react";

// Dynamically import the microfrontend app (without Router)
const MicrofrontendApp = React.lazy(() => import("microfrontend/App"));

const MicrofrontendWrapper: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading Microfrontend...</div>}>
        <MicrofrontendApp />
      </Suspense>
    </div>
  );
};

export default MicrofrontendWrapper;
