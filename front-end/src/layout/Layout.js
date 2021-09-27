import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";
import "../colors.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div>
      <div>
        <div className="dark-violet fixed-top">
          <Menu />
        </div>
        <div className="goldenrod body">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
