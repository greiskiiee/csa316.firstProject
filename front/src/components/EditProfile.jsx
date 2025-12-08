"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";

export default function EditProfile({ _id }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [originalUser, setOriginalUser] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${_id}`)
      .then((res) => {
        setOriginalUser({
          name: res.data.user.username,
          email: res.data.user.email,
          phoneNumber: res.data.user.phoneNumber,
        });
        setName(res.data.user.username);
        setEmail(res.data.user.email);
        setPhoneNumber(res.data.user.phoneNumber);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      });
  }, [_id]);

  const handleSave = () => {
    if (name !== originalUser.name || email !== originalUser.email) {
      axios
        .put(`${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${_id}`, {
          username: name,
          email: email,
        })
        .then((res) => {
          alert("Profile updated successfully.");
          setOriginalUser({ name, email });
        })
        .catch((err) => {
          console.error("Update failed:", err);
          alert("Failed to update profile.");
        });
    } else {
      alert("No changes detected.");
    }
  };

  return (
    <div className="w-full ml-9 flex flex-col gap-4 bg-[#e9e9e9] py-2 px-4 rounded-md">
      <div>
        <Label htmlFor="name" className="text-[#2a2c41] text-[12px]">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-[#2a2c41] text-[12px]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-[#2a2c41] text-[12px]">
          Phone number
        </Label>
        <Input
          id="tel"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-2 p-2 border rounded-md"
        />
      </div>
      <Button
        onClick={handleSave}
        className="mt-4 py-2 px-4 bg-[#2a2c41] text-[#f4f4f8] text-[12px] rounded-md"
      >
        Save Changes
      </Button>
    </div>
  );
}
