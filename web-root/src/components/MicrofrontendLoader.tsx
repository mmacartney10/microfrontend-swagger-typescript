import React, { Suspense, lazy } from "react";

interface MicrofrontendLoaderProps {
  name: "microfrontend" | "microfrontend2" | "microfrontend3";
}

const Microfrontend = React.lazy(() => import("microfrontend/App"));
const Microfrontend2 = React.lazy(() => import("microfrontend2/App"));
const Microfrontend3 = React.lazy(() => import("microfrontend3/App"));

const Loading = () => {
  return <h1>Loading microfrontend...</h1>;
};

const MicrofrontendLoader: React.FC<MicrofrontendLoaderProps> = ({ name }) => {
  const getComponent = () => {
    switch (name) {
      case "microfrontend":
        return Microfrontend;
      case "microfrontend2":
        return Microfrontend2;
      case "microfrontend3":
        return Microfrontend3;
      default:
        return lazy(() =>
          Promise.reject(new Error(`Unknown microfrontend: ${name}`)),
        );
    }
  };

  const Component = getComponent();

  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default MicrofrontendLoader;
