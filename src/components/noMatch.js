import React from "react";
import Header from "../containers/Header";
export default ({ location }) => {  
  return (
    <div>
      <Header />
      <div className="container">
        <h3>Oops...</h3>
        <code>{location.pathname}</code>
        <p>This page doesn't exist, please go back.</p>
      </div>
    </div>
  );
};
