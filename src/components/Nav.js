import React from "react";
import { Link } from "react-router-dom";

const Nav = ({ showBackButton = false, children }) => {


  return (
    <nav className="navbar">
      {showBackButton && (
        <button className="back__button" onClick={() => window.history.back()}>
          <svg width="2rem" viewBox="0 0 1792 1792">
            <path
              d="M259.9,983.3c-23.6-23.2-35.9-55.6-33.6-88.6c-2.4-31.9,10-63,33.6-84.6l546.3-548.3c45.4-45.4,119-45.4,164.4,0
	s45.4,119,0,164.4L616.3,780.5h833.6c63.8-0.4,115.8,51,116.1,114.8c0,0.2,0,0.4,0,0.7c-0.4,64-52.1,115.8-116.1,116.1H616.3
	l354.4,353.7c45.4,45.4,45.4,119,0,164.4s-119,45.4-164.4,0l0,0L259.9,983.3z"
            />
          </svg>
        </button>
      )}
      <h3>{children}</h3>
      <div className="nav-logout">
      <Link
        to={'/'}
      >
        Logout
      </Link>
      </div>
    </nav>
  );
};

export default Nav;
