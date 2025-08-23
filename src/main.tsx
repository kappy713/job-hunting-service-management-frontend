import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Home from "./routes/home";
import About from "./routes/about";
import Servicees from "./routes/es";
import Login from "./routes/login";
import SignUp from "./routes/signup";
import Services from "./routes/services";
import SampleUsers from "./routes/sample-users";
import ES from "./routes/es";
import Register from "./routes/register";

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
    path: "/servicees",
    element: <Servicees />,
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
    path: "/services",
    element: <Services />,
  },
  {
    path: "/sample-users",
    element: <SampleUsers />,
  },
  {
    path: "/es",
    element: <ES />,
   },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
