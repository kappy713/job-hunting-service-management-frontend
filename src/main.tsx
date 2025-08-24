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

// デバッグ情報を最初に出力
console.log('🚀 App starting - Environment variables:', {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  all: import.meta.env
});

// グローバルエラーハンドラー
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
  console.error('🚨 Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

// 未処理のPromise rejectionもキャッチ
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

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
