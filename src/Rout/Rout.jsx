import {
  createBrowserRouter,
} from "react-router";
import '../index.css'


import React from "react";
import ReactDOM from "react-dom/client";
import Root from "../Root/Root";
import Home from "../Root/Home";
import Register from "../Components/Authicantion/Login-register/Register";
import Login from "../Components/Authicantion/Login-register/Login";

export const router = createBrowserRouter([
  {
    path: "/",
   Component:Root,
   children:[
    {
      index:true,
      path:'/',
      Component:Home,
    },
    {
      path:'/register',
      Component:Register,
    },
    {
      path:'/login',
      Component:Login,
    }
   ]
  },
]);
