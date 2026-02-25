import React from "react";
import webpackLogo from "../assets/webpack.png";

interface AboutProps {
  msg: string;
}

const About: React.FC<AboutProps> = ({ msg }) => {
  return (
    <main>
      <div id="app">
        <img alt="Webpack logo" src={webpackLogo} />
        <h1 className="heading">
          This is the <span>About</span> page!
        </h1>
        <p>This is a webpack + {msg} project.</p>
      </div>
    </main>
  );
};

export default About;
