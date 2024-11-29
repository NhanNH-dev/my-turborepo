"use client";
import { signIn, useSession } from "next-auth/react";
import LoginForm from "app/components/LoginForm/LoginForm";

export default function LoginPage() {
  const { status } = useSession();

  const handleCredentialsLogin = async (e: any, userInfo: any) => {
    e.preventDefault();
    const { username, password } = userInfo;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        alert("Login failed: " + result.error);
      } else {
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  };

  const handleCreateNewUser = async (e: React.FormEvent, user: { username: string; password: string }) => {
    e.preventDefault();
  
    if (!user.username || !user.password) {
      alert("Both username and password are required.");
      return;  // Stop execution if either field is missing
    }
    const {username, password} = user;
    const res = await signIn("credentials", {
      redirect: false,  // Prevent automatic redirection
      username,
      password
    });
  
    if (res?.error) {
      // Xử lý lỗi nếu có, ví dụ: nếu username đã tồn tại
      console.error("Login error:", res.error);
    } else {
      // Nếu không có lỗi, có thể chuyển hướng đến trang chính hoặc dashboard
      console.log("User logged in or created successfully");
    }
  };
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <LoginForm 
    handleCredentialsLogin={handleCredentialsLogin} 
    handleCreateNewUser={handleCreateNewUser}
    />;
  }

  return null;
}
