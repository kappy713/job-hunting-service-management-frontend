import { useState } from "react";
import { Link } from "react-router-dom";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [count, setCount] = useState(0);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      // Supabaseに現在のユーザー情報を問い合わせる
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("取得したユーザー情報:", user);
      setUser(user); // 取得したユーザー情報をStateに保存
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          {user ? (
            <p className="text-xl">
              Email:
              <span className="font-bold">{user.email}</span>
              <br />
              ID:
              <span className="font-bold">{user.id}</span>
            </p>
          ) : (
            <p className="text-xl">ログインしていません</p>
          )}
        </div>
        {/* Logo Section */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <a
            href="https://vite.dev"
            target="_blank"
            className="group transition-transform hover:scale-110 duration-300"
          >
            <img
              src={viteLogo}
              className="h-16 w-16 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
              alt="Vite logo"
            />
          </a>
          <div className="text-4xl font-bold text-white opacity-70">+</div>
          <a
            href="https://react.dev"
            target="_blank"
            className="group transition-transform hover:scale-110 duration-300"
          >
            <img
              src={reactLogo}
              className="h-16 w-16 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 animate-spin"
              style={{ animationDuration: "10s" }}
              alt="React logo"
            />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Vite + React
        </h1>

        {/* Counter Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            Count is {count}
          </button>
          <p className="text-white/80 mt-6 text-lg">
            Edit{" "}
            <code className="bg-black/30 px-2 py-1 rounded text-cyan-300 font-mono">
              src/routes/home.tsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>
        {/* Navigation Links */}
        <div className="flex justify-center space-x-4">
          <Link
            to="/about"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            About
          </Link>
          <Link
            to="/login"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
          <Link
            to="/sample-users"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Sample Users
          </Link>
        </div>
        <div className="flex justify-center">
          <Link
            to="/services"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Services
          </Link>
        </div>
      </div>
    </div>
  );
}
