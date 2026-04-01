"use client";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

GoogleBtn.propTypes = {
  label: PropTypes.string,
};

export default function GoogleBtn({ label = "Google-р нэвтрэх" }) {
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Backend URI:", process.env.NEXT_PUBLIC_BACKEND_URI);

        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/google`,
          { access_token: tokenResponse.access_token },
        );

        localStorage.setItem("token", response.data.token);
        router.push("/home");
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: () => console.error("Google login error"),
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      className="w-full h-[44px] rounded-xl border border-[#2a2c41] text-[#2a2c41] bg-white text-sm font-medium flex items-center justify-center gap-3"
    >
      <span className="text-[30px] leading-none font-semibold">G</span>
      {label}
    </button>
  );
}
