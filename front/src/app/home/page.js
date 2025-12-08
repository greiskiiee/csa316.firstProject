"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { History, ReceiptText, User, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import EditProfile from "@/components/EditProfile";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("token");
    if (!token) return null;
    console.log(token, "token");
  }

  try {
    const decoded = jwtDecode(token);
    return decoded._doc._id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export default function Home() {
  const router = useRouter();

  const [edit, setEdit] = useState(false);

  const onEdit = () => {
    setEdit(!edit);
  };

  const userId = getUserIdFromToken();

  const handleLogout = () => {
    router.push("/");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      console.log("token deleted");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#2a2c41] ">
      <div className="w-[90%] flex justify-between mb-3 items-center">
        <div className="w-fit h-full text-[#ff724c] montserrat font-[500] text-[18px] lg:text-[26px] flex justify-center items-center py-2 box-border rounded-md">
          EatWell+
        </div>
        <NavigationMenu>
          <NavigationMenuList className="gap-2 ">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="invisible lg:visible">
                Recipes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="invisible lg:visible">
                Advices
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="w-[24px] h-[24px] bg-[#ff724c] flex justify-center items-center lg:w-[40px] lg:h-[40px] rounded-full">
          <Sheet>
            <SheetTrigger className="flex justify-center items-center">
              <User
                color="white"
                className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]"
              />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="h-full flex flex-col justify-between items-start">
                <div className="flex flex-col justify-between items-start gap-10">
                  <SheetTitle className="montserrat text-[22px]">
                    My profile
                  </SheetTitle>
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col justify-start items-start gap-3">
                      <div className="flex justify-start items-center gap-3">
                        {" "}
                        <UserRoundPen />
                        <div
                          className="py-2 px-4 montserrat rounded-md text-[14px] font-[500] text-[#2a2c41] hover:bg-[#fcc050] hover:text-[#2a2c41] transition-colors"
                          onClick={onEdit}
                        >
                          Edit Profile
                        </div>{" "}
                      </div>

                      {edit && <EditProfile _id={userId} />}
                    </div>
                    <div className="flex justify-start items-center gap-3">
                      <History />
                      <div className="py-2 px-4 montserrat rounded-md text-[14px] font-[500] text-[#2a2c41] hover:bg-[#fcc050] hover:text-[#2a2c41] transition-colors ">
                        History
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-3">
                      <ReceiptText />
                      <div className="py-2 px-4 montserrat rounded-md text-[14px] font-[500] text-[#2a2c41] hover:bg-[#fcc050] hover:text-[#2a2c41] transition-colors">
                        Terms and conditions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-fit h-fit py-2 px-4 bg-[#ff724c]/60 text-[#2a2c41] rounded-md hover:bg-[#ff724c] hover:text-[#2a2c41] transition-colors">
                  <Dialog>
                    <DialogTrigger>Log out</DialogTrigger>
                    <DialogContent className="w-[300px]">
                      <DialogHeader>
                        <DialogTitle>Are you sure logging out?</DialogTitle>
                        <DialogDescription>
                          You are loggin out
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <div className="w-full flex justify-between">
                            <Button
                              type="button"
                              variant="secondary"
                              className="bg-[#ff724c] "
                            >
                              Close
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className="bg-[#b4b4b4]"
                              onClick={handleLogout}
                            >
                              Log out
                            </Button>
                          </div>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="w-[90%] h-[90%] flex flex-col lg:flex-row justify-center items-center rounded-xl  ">
        <div className="w-full h-1/2 lg:w-1/2 lg:h-full bg-[#f4f3f8] rounded-t-xl lg:rounded-l-xl lg:rounded-t-none flex flex-coljustify-center items-center py-8 px-6 gap-6">
          <div className="w-full h-full flex justify-center items-center border border-gray-300 rounded-md">
            CONTENT
          </div>
        </div>
        <div className="w-full h-1/2 lg:w-1/2 lg:h-full flex flex-col justify-between gap-2 py-8 px-6 bg-[#f4f3f8] rounded-b-xl lg:rounded-b-none lg:rounded-r-xl">
          <div className="w-full h-1/2 flex justify-center items-center bg-[#7c7c7b]/50 rounded-md">
            Create a recipe from my ingredients
          </div>
          <div className="w-full h-1/2 flex justify-center items-center bg-[#fcc050]/50 rounded-md">
            Analysis product with barcode
          </div>
        </div>
      </div>
    </div>
  );
}
