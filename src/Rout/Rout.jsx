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
import BiodatasDtails from "../Components/Biodatas/Premium_members/BiodatasDtails";
import AllBiodatas from "../Components/Biodatas/Premium_members/AllBiodatas";
import AboutUs from "../Components/About/AboutUs";
import ContactUs from "../Components/Contact/ContactUs";

export const router = createBrowserRouter([
  {
    path: "/",
   Component:Root,
   children:[
    {
      index:true,
      path:'/',
      loader: () => fetch('http://localhost:3000/biodatas'),
      Component:Home,
    },
    {
      path:'/biodata/:id',
      loader: ({ params }) => fetch(`http://localhost:3000/biodatas/${params.id}`),
      Component:BiodatasDtails,
    },
    {
      path:'/about',
      Component:AboutUs
    },
    {
      path:'/contact',
      Component:ContactUs
    },
    {
      path:'/all-biodatas',
      loader: () => fetch('http://localhost:3000/biodatas'),
      Component:AllBiodatas,
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
