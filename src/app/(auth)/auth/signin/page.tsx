"use client";

import { LoginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { outputGrpcErrorMessage } from "@/utils/grpcError";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { LoginByGoogle } from "@/actions/google_auth";
import Image from "next/image";


function page() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await LoginUser(form.email, form.password);
      Cookies.set("__t__", response.token, {
        expires: 1 / 24,
      });
      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      });
      router.push("/dashboard")
    } catch (error) {
      const errorMessage = outputGrpcErrorMessage(error);
      toast({
        title: "Login Error",
        description: errorMessage, // Only display the relevant part
        variant: "destructive",
      });
    }
  };

  const handleLoginGoogle = async () => {
    try {
      const response = await LoginByGoogle();
      const url : string = String(response.url);
      
      window.location.href = url
    }
    catch (error) {
      const errorMessage = outputGrpcErrorMessage(error);
      toast({
        title: "Login Error",
        description: errorMessage, // Only display the relevant part
        variant: "destructive",
      });
    }
  }
  return (
    <main className="w-full bg-slate-100 flex flex-col justify-center items-center h-screen">
      <form
        className="w-3/5 bg-white border border-border flex items-start flex-col justify-center p-6 rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-center w-full ">Login</h1>
        <div className="flex flex-col gap-1.5 mb-5 w-full">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            value={form.email}
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-5 w-full">
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            value={form.password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
        <Button variant={"outline"} className="w-full mt-5 flex items-center justify-center" type="button" onClick={handleLoginGoogle}>
          <Image src="/auth_page/google.svg" width={36} height={36} alt="google" quality={100} />
          <span>Login with Google</span>
        </Button>
      </form>
    </main>
  );
}

export default page;
