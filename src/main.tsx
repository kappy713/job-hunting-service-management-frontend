import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Home from "./routes/home";
import About from "./routes/about";
import Login from "./routes/login";
import SignUp from "./routes/signup";
import Services from "./routes/services";
import SampleUsers from "./routes/sample-users";
import Register from "./routes/register";
import Profile from "./routes/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/register-services",
    element: <Services />,
  },
  {
    path: "/sample-users",
    element: <SampleUsers />,
  },
  {
    path: "/register-profile",
    element: <Register />,
  },
  {
    path: "/register-es",
    element: <Profile />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
