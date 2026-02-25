import React, { Suspense } from "react";

// Dynamically import the microfrontend app (without Router)
const MicrofrontendApp = React.lazy(() => import("microfrontend/App"));

const MicrofrontendApp2 = React.lazy(() => import("microfrontend2/App"));

interface MicrofrontendWrapperProps {
  app: "microfrontend" | "microfrontend2";
}

const MicrofrontendWrapper: React.FC<MicrofrontendWrapperProps> = ({ app }) => {
  return (
    <div>
      <Suspense fallback={<div>Loading Microfrontend...</div>}>
        {app === "microfrontend" ? <MicrofrontendApp /> : <MicrofrontendApp2 />}
      </Suspense>
    </div>
  );
};

export default MicrofrontendWrapper;
