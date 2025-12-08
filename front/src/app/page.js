import { SignUp } from "@/components/SignUp";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#2a2c41]">
      <div className="w-[90%] h-[90%] flex flex-col justify-center items-center rounded-xl lg:flex-row">
        <div className="w-full lg:w-1/2 h-[100px] lg:h-full bg-[#f4f3f8] rounded-t-xl lg:rounded-l-xl lg:rounded-t-none flex flex-col justify-center items-center py-20 gap-6">
          <p className="text-[#2a2c41] montserrat  text-[26px] lg:text-[52px] font-[500] ">
            Welcome to
          </p>
          <p className="text-[#fcc050] montserrat text-[28px] lg:text-[92px] font-[600] text-shadow-lg/30 ">
            EatWell+
          </p>
        </div>
        <div className="w-full lg:w-1/2 h-fit lg:h-full py-8 px-6 bg-[#f4f3f8] rounded-b-xl lg:rounded-r-xl lg:rounded-b-none">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
