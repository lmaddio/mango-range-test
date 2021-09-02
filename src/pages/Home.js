import React from "react";
import { Link } from "react-router-dom";

export const Home = () => (
  <>
    <h1>Range Component</h1>
    <Link to="/exercise1"><p>Exercise 1</p></Link>
    <Link to="/exercise2"><p>Exercise 2</p></Link>
  </>
);
