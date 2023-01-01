"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  adminCode?: string;
}

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>({ name: "", email: "", password: "", adminCode: "" });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          adminCode: form.adminCode?.trim()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("⚠️ Failed to connect to the server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Create an Account</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Sign up to continue to User Management App</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="john@example.com"
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

            <div>
              <Label htmlFor="adminCode">Admin Code (optional)</Label>
              <Input
                id="adminCode"
                name="adminCode"
                placeholder="Enter admin code"
                value={form.adminCode}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Signup"
              )}
            </Button>
<p className="text-sm text-center text-gray-500 mt-4">
  Already have an account?{" "}
  <a
    href="/login"
    className="text-purple-600 hover:text-purple-800 font-medium"
  >
    Login
  </a>
</p>
          </form>

          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
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
