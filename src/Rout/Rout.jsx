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
import Dashboard_home from "../Components/Normal_user/Dashboard/Dashboard_home";
import Dashboard_nav from "../Components/Normal_user/Dashboard/Dashboard_nav";
import EditBiodata from "../Components/Normal_user/Biodata/EditBiodata";
import ViewBiodata from "../Components/Normal_user/Biodata/ViewBiodata";
import Create_Biodata from "../Components/Normal_user/Biodata/Create_Biodata";
import Favorite from "../Components/Normal_user/Favorite/Favorite";
import User from "../Components/Admin_Control/User";
import UpgradePremium from "../Components/Normal_user/upgrade/UpgradePremium";
import ManageBiodatas from "../Components/Admin_Control/Manage Biodatas/ManageBiodatas";
import PremiumApproved from "../Components/Admin_Control/Approved/PremiumApproved";
import ContactReq from "../Components/Admin_Control/Approved/ContactReq";
import ManagePayments from "../Components/Admin_Control/Manage_payments/Manage_payments";
import UserReqSend from "../Components/Normal_user/Checkout/UserReqSend";
import ErrorPage from "../Components/Error/ErrorPage";


export const router = createBrowserRouter([
  {
    path: "/",
   Component:Root,
   errorElement:<ErrorPage></ErrorPage>,
   children:[
    {
      index:true,
      path:'/',
      loader: () => fetch('https://matrimony-server-side-sigma.vercel.app/biodatas'),
      Component:Home,
    },
    {
      path:'/biodata/:id',
      loader: ({ params }) => fetch(`https://matrimony-server-side-sigma.vercel.app/biodatas/${params.id}`),
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
      loader: () => fetch('https://matrimony-server-side-sigma.vercel.app/biodatas'),
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
  {
    path: '/dashboard',
     Component: Dashboard_nav,
     errorElement:<ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
       Component: Dashboard_home,
      },
      {
        path: '/dashboard/create-biodata',
        Component: Create_Biodata,
      },
      {
        path: '/dashboard/edit-biodata',
        Component: EditBiodata,
      },
      {
        path: '/dashboard/view-biodata',
        Component: ViewBiodata,
      },
      {
        path:'/dashboard/contact-requests',
        Component:UserReqSend
      },
      {
        path:'/dashboard/favorites',
        Component:Favorite
      },
      {
        path:'/dashboard/manage-users',
        Component:User
      },
      {
        path:'/dashboard/upgrade-premium',
        Component:UpgradePremium
      },
      {
        path:'/dashboard/manage-biodatas',
        Component:ManageBiodatas
      },
      {
        path:'/dashboard/approve-premium',
        Component:PremiumApproved
      },
      {
        path:'/dashboard/approve-contact-requests',
        Component:ContactReq
      },
      {
        path:'/dashboard/manage-payments',
        Component:ManagePayments
      },

    ],
  },
]);
