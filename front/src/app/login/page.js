"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUser] = useState({
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
  });

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [passError, setPassError] = useState("");

  const [userAdded, setMessage] = useState(false);

  const router = useRouter();

  const handleLogIn = async () => {
    const data = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/login`,
        data
      );

      const token = response.data.token;
      const expiryTime = 60 * 1000 * 60;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);

        // Automatically logout after 1 hour
        setTimeout(() => {
          localStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          router.push("/login");
        }, expiryTime);
      }

      router.push("/home");
    } catch (error) {
      if (error.response?.status === 404) {
        setPassError("Invalid password or email.");
      }
      console.error("Login failed:", error);
    }
  };

  const sendMail = async () => {
    const userMail = emailRef.current.value;
    const otp = Math.floor(Math.random() * 100000) + 10000;
    console.log(otp);
    try {
      //   const user = await axios.get(
      //     `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${userId}`
      //   );
      //   const userMail = user.data.user.email;
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/mail`, {
        email: userMail,
        subject: "Hello, here is your password",
        text: `Your otp is ${otp}. Please update your password.`,
      });
      alert("Your otp is sent to your email.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#2a2c41]">
      <div className="w-[90%] h-[90%] flex flex-col justify-center items-center rounded-xl lg:flex-row">
        <div className="w-full lg:w-1/2 h-[100px] lg:h-full bg-[#f4f3f8] rounded-t-xl lg:rounded-l-xl lg:rounded-t-none flex flex-col justify-center items-center py-20 gap-6">
          <p className="text-[#2a2c41] montserrat  text-[26px] lg:text-[52px] font-[500] ">
            Welcome Back
          </p>
          <p className="text-[#fcc050] montserrat text-[28px] lg:text-[92px] font-[600] text-shadow-lg/30 ">
            EatWell+
          </p>
        </div>
        <div className="w-full lg:w-1/2 h-fit lg:h-full py-8 px-6 bg-[#f4f3f8] rounded-b-xl lg:rounded-r-xl lg:rounded-b-none">
          <div className="w-full h-full py-5 flex flex-col justify-center items-start gap-8">
            <div className="flex justify-start items-center gap-1">
              <p className="text-[#2a2c41] montserrat text-[16px] lg:text-[22px]">
                Don't have an account?{" "}
                <span
                  className="text-[#fcc050] montserrat underline cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  Sign Up
                </span>
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              {/* Email */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-[#2a2c41]">Email</Label>
                <Input
                  type="email"
                  className="lg:w-[80%] py-1 px-4 rounded-md bg-white"
                  placeholder="Enter your email"
                  ref={emailRef}
                />
              </div>

              {/* Password */}
              <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                <Label className="text-[#2a2c41]">Password</Label>
                <div className="relative lg:w-[80%]">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-1 px-4 pr-10 rounded-md bg-white"
                    placeholder="Enter your password"
                    ref={passwordRef}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="montserrat text-[12px] text-[#f00]">
                  {passError}
                </p>
              </div>

              <p
                className="montserrat text-[14px] underline text-[#2a2c41]"
                onClick={sendMail}
              >
                Forgot password ?
              </p>
            </div>

            <div className="flex flex-col justify-center gap-2 w-full items-center lg:items-start">
              <button
                className="w-fit rounded-md px-3 box-border text-[#f4f4f8] montserrat font-[500] bg-[#fc8d6f] border border-transparent py-2 hover:opacity-80  hover:border-gray-300"
                onClick={handleLogIn}
              >
                Login
              </button>

              {userAdded && (
                <p className="montserrat text-[12px] font-[500] text-[#f00]">
                  {userAdded === "success"
                    ? "Logged in successfully!"
                    : "Please fill all fields"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
