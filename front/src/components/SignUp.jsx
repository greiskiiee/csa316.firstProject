"use client";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(null);

  const emailRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  const [userAdded, setMessage] = useState(false);

  const router = useRouter();

  const handlePass = () => {
    if (passwordRef.current.value.length < 8) {
      setPassError("Нууц үг багадаа 8 тэмдэгт байх ёстой");
    } else {
      setPassError("");
    }
  };

  const handleEmail = () => {
    if (emailRegex.test(emailRef.current.value)) {
      setEmailError("");
    } else {
      setEmailError("Зөв и-мэйл оруулна уу!");
    }
  };

  const handleConfirmPass = () => {
    if (confirmPasswordRef.current.value === passwordRef.current.value) {
      setConfirmPassError("");
    } else {
      setConfirmPassError("Нууц үг тохирохгүй байна!");
    }
  };

  const handleSubmit = async () => {
    const data = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/user`, data);
      setMessage("success");

      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.messsage === "email already taken"
      ) {
        setMessage("email_taken");
      } else {
        setMessage("error");
      }
      console.log(error);
    }
  };
  return (
    <div className="md:w-[60%] w-full h-full py-5 flex flex-col justify-center items-start gap-8">
      <div className="flex justify-start items-center gap-1">
        <p className="text-[#2a2c41] montserrat text-3xl font-bold">
          Бүртгүүлэх
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Email */}
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[#2a2c41]">И-мэйл хаяг</Label>
          <Input
            type="email"
            className="py-1 px-4 rounded-md bg-white"
            placeholder="Энд и-мэйлээ оруулна уу"
            ref={emailRef}
            onChange={handleEmail}
          />
          <p className="montserrat text-[12px] text-[#f00]">{emailError}</p>
        </div>

        {/* Username */}
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[#2a2c41]">Нэвтрэх нэр</Label>
          <Input
            type="text"
            className="py-1 px-4 rounded-md bg-white"
            placeholder="Энд нэвтрэх нэрээ оруулна уу"
            ref={usernameRef}
          />
        </div>

        {/* Password */}
        <div className="grid w-full items-center gap-1.5 relative">
          <Label className="text-[#2a2c41]">Нууц үг</Label>
          <div className="relative ">
            <Input
              type={showPassword ? "text" : "password"}
              className="w-full py-1 px-4 pr-10 rounded-md bg-white"
              placeholder="Нууц үг үүсгэх"
              ref={passwordRef}
              onChange={handlePass}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="montserrat text-[12px] text-[#f00]">{passError}</p>
        </div>

        {/* Confirm Password */}
        <div className="grid w-full items-center gap-1.5 relative">
          <Label className="text-[#2a2c41]">Нууц үг баталгаажуулах</Label>
          <div className="relative ">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full py-1 px-4 pr-10 rounded-md bg-white"
              placeholder="Нууц үгээ давтана уу"
              ref={confirmPasswordRef}
              onChange={handleConfirmPass}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="montserrat text-[12px] text-[#f00]">
            {confirmPassError}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center gap-4 items-center lg:items-start ">
        <button
          className="w-full h-[44px] rounded-xl px-3 box-border text-[#f4f4f8] montserrat font-[500] bg-[#fc8d6f] border border-transparent py-2 hover:opacity-80  hover:border-gray-300"
          onClick={handleSubmit}
        >
          Бүртгүүлэх
        </button>

        {userAdded && (
          <p className="montserrat text-[12px] font-[500] text-[#f00]">
            {userAdded === "success"
              ? "Амжилттай бүртгүүллээ!"
              : userAdded === "email_taken"
                ? "Бүртгэлтэй и-мэйл байна!"
                : "Бүх талбарыг бөглөнө үү!"}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full h-[44px] rounded-xl border border-[#2a2c41] text-[#2a2c41] bg-white text-sm font-medium flex items-center justify-center gap-3 "
        >
          <span className="text-[30px] leading-none font-semibold">G</span>
          Google-р нэвтрэх
        </button>
      </div>

      <div className="flex justify-start items-center gap-1">
        <p className="text-[#2a2c41] montserrat text-sm">
          Бүртгэлтэй бол{" "}
          <span
            className="text-[#fcc050] montserrat underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Нэвтрэх
          </span>
        </p>
      </div>
    </div>
  );
};
