import React, { Suspense, lazy, useEffect, useState } from "react";

import routes from "../routes/routes.json";

type MicrofrontendName = "microfrontend" | "microfrontend2" | "microfrontend3";

interface MicrofrontendLoaderProps {
  name: MicrofrontendName;
}

const Loading = () => {
  return <h1>Loading microfrontend...</h1>;
};

export const loadRemoteEntry = (remoteUrl: string, scope: string) => {
  return new Promise((resolve, reject) => {
    if ((window as any)[scope]) {
      return resolve(void 0);
    }

    const script = document.createElement("script");
    script.src = remoteUrl;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      resolve(void 0);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

function loadComponent(scope: string, module: string) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    // @ts-ignore
    await __webpack_init_sharing__("default");
    // @ts-ignore
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignore
    const factory = await container.get(module);
    const Module = factory();

    return Module;
  };
}

const MicrofrontendLoader: React.FC<MicrofrontendLoaderProps> = ({ name }) => {
  const [Component, setComponent] =
    useState<React.LazyExoticComponent<any> | null>(null);

  useEffect(() => {
    let isMounted = true;
    const config = routes.routes.find((route) => route.name === name);

    if (!config) {
      setComponent(() =>
        lazy(() => Promise.reject(new Error(`Unknown microfrontend: ${name}`))),
      );
      return;
    }

    loadRemoteEntry(config.url, config.name).then(() => {
      const Comp = lazy(loadComponent(config.name, config.module));
      if (isMounted) setComponent(() => Comp);
    });

    return () => {
      isMounted = false;
    };
  }, [name]);

  if (!Component) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default MicrofrontendLoader;
