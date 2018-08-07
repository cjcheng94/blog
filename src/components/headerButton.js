import React from "react";
import { Link } from "react-router-dom";

const HeaderButton = props => (
  <li className="waves-effect waves-light">
    <Link to={props.to}>{props.text}</Link>
  </li>
);
export default HeaderButton;
