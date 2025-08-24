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
const debugInfo = {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  all: import.meta.env
};

console.log('🚀 App starting - Environment variables:', debugInfo);
console.error('🚀 FORCE DEBUG - Environment variables:', debugInfo);
console.warn('🚀 WARN DEBUG - Environment variables:', debugInfo);

// DOMにも表示（開発時のみ）
if (!import.meta.env.PROD) {
  document.addEventListener('DOMContentLoaded', () => {
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      background: red;
      color: white;
      padding: 10px;
      z-index: 9999;
      font-family: monospace;
      font-size: 12px;
      max-width: 300px;
      word-break: break-all;
    `;
    debugDiv.innerHTML = `DEBUG: VITE_BACKEND_URL = ${import.meta.env.VITE_BACKEND_URL || 'UNDEFINED'}`;
    document.body.appendChild(debugDiv);
    
    // 5秒後に削除
    setTimeout(() => debugDiv.remove(), 5000);
  });
}

// alertでも強制表示
if (typeof window !== 'undefined') {
  window.setTimeout(() => {
    console.log('🔥 FORCED LOG:', { 
      backend_url: import.meta.env.VITE_BACKEND_URL,
      env_keys: Object.keys(import.meta.env)
    });
  }, 1000);
}

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
