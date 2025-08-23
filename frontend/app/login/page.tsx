"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token?: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: LoginResponse = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token stored:", data.token);
        setMessage("✅ Login successful!");
        router.push("/profile");
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("⚠️ Failed to connect to the server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Log in to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                typeof message === "string" && message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
