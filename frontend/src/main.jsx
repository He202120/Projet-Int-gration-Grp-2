import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

//? ==================================== User Screens Import ====================================
import PrivateRoutes from "./screens/userScreens/PrivateRoutes.jsx";
import HomeScreen from "./screens/userScreens/HomeScreen.jsx";
import LoginScreen from "./screens/userScreens/LoginScreen.jsx";
import RegisterScreen from "./screens/userScreens/RegisterScreen.jsx";
import ProfileScreen from "./screens/userScreens/ProfileScreen.jsx";

import AboUser from "./screens/userScreens/AbonnementScreen.jsx";

import ParkingAccess from "./screens/userScreens/ParkingAccess.jsx";

import AvisUser from "./screens/userScreens/AddAvisScreen.jsx";

//? ==================================== Admin Screens Import ====================================
import AdminPrivateRoutes from "./screens/adminScreens/PrivateRoutes.jsx";
import AdminHomeScreen from "./screens/adminScreens/HomeScreen.jsx";
import AdminLoginScreen from "./screens/adminScreens/LoginScreen.jsx";
import AdminRegisterScreen from "./screens/adminScreens/RegisterScreen.jsx";
import AdminProfileScreen from "./screens/adminScreens/ProfileScreen.jsx";
import UsersManagementScreen from "./screens/adminScreens/UsersManagementScreen.jsx";
import MonitoringScreen from "./screens/adminScreens/MonitoringScreen.jsx";
import ReviewScreen from "./screens/adminScreens/ReviewScreen.jsx";
import HandleParking from "./screens/adminScreens/HandleParkingScreen.jsx";
import SubscriptionScreen from "./screens/adminScreens/SubscriptionScreen.jsx";
import Dashboard from "./screens/adminScreens/Dashboard.jsx"
// import ReviewScreen from "./screens/adminScreens/ReviewScreen.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* ===================================== User Routes ===================================== */}

      <Route index={true} path="/" element={<HomeScreen />} />

      <Route path="/login" element={<LoginScreen />} />

      <Route path="/register" element={<RegisterScreen />} />

      <Route path="/abonnement" element={<AboUser />} />

      <Route path="/addreview" element={<AvisUser />} />

      {/* USER PRIVATE ROUTES */}
      <Route path="" element={<PrivateRoutes />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/parkingAccess" element={<ParkingAccess />} />
        <Route path="/addreview" element={<addreview />} />
      </Route>

      {/* ===================================== Admin Routes ===================================== */}

      <Route path="/admin" element={<AdminHomeScreen />} />

      <Route path="/admin/login" element={<AdminLoginScreen />} />

      <Route path="/admin/register" element={<AdminRegisterScreen />} />

      {/* ADMIN PRIVATE ROUTES */}
      <Route path="" element={<AdminPrivateRoutes />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<AdminProfileScreen />} />
        <Route path="/admin/manage-users" element={<UsersManagementScreen />} />
        <Route path="/admin/monitoring" element={<MonitoringScreen />} />
        <Route path="/admin/review" element={<ReviewScreen />} />
        <Route path="/admin/handle" element={<HandleParking />} />
        <Route path="/admin/sub" element={<SubscriptionScreen />} />        

        {/* <Route path="/admin/review" element={<ReviewScreen />} /> */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
