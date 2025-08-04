import {
  createBrowserRouter,
} from "react-router";
import '../index.css'


import React from "react";
import ReactDOM from "react-dom/client";
import Root from "../Root/Root";
import Home from "../Root/Home";

export const router = createBrowserRouter([
  {
    path: "/",
   Component:Root,
   children:[
    {
      index:true,
      path:'/',
      Component:Home,
    }
   ]
  },
]);
