import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import RegisterPage from "./pages/AuthPage/RegisterPage";
import UserPage from "./pages/UserPage/UserPage";
import PostPage from "./pages/PostPage/PostPage";
import SubsPage from "./pages/SubsPage/SubsPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import ResetPassword from "./pages/AuthPage/ResetPassword";

export const useRoutes = (isLogin) => {
  if (isLogin) {
    return (
      <Routes>
        <Route exect path="/" element={<MainPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/subs/:id" element={<SubsPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route exect path="/" element={<MainPage />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resetpass" element={<ResetPassword />} />
    </Routes>
  );
};
