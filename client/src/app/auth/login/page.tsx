"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { protectSignInAction } from "@/actions/auth";
import banner from "../../../../public/images/banner2.jpg";
import logo from "../../../../public/images/logo1.png";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignInAction(
      formData.email
    );

    if (!checkFirstLevelOfValidation.success) {
      toast({
        title: checkFirstLevelOfValidation.error,
        variant: "destructive",
      });
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      toast({
        title: "Login Successful!",
      });
      const user = useAuthStore.getState().user;
      if (user?.role === "SUPER_ADMIN") router.push("/super-admin");
      else router.push("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff6f4] to-[#ffe6e1] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left Banner Section */}
        <div className="hidden lg:block w-full lg:w-1/2 relative overflow-hidden">
          <Image
            src={banner}
            alt="Login Banner"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            className="transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Welcome Back!</h2>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-10 lg:p-16 justify-center bg-[#fff6f4]">
          <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src={logo}
                width={200}
                height={50}
                alt="Logo"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold text-[#3f3d56]">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="bg-[#ffede1] border-2 border-[#e0d0c6] rounded-lg focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleOnChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-semibold text-[#3f3d56]">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="bg-[#ffede1] border-2 border-[#e0d0c6] rounded-lg focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleOnChange}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ff6f61] text-white font-bold py-3 rounded-lg hover:bg-[#e55a50] transition-colors duration-300 shadow-md flex items-center justify-center"
              >
                {isLoading ? (
                  "Logging In..."
                ) : (
                  <>
                    LOGIN
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-center text-[#3f3d56] text-sm mt-4">
                New here?{' '}
                <Link
                  href="/auth/register"
                  className="text-[#ff6f61] font-semibold hover:underline transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}