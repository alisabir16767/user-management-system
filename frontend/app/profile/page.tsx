"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  name: string;
  email: string;
}

interface ApiResponse {
  message: string;
  name?: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState<string>("");
  const [updateForm, setUpdateForm] = useState<{ name?: string; password?: string }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data: ApiResponse = await res.json();
        if (res.ok && data.name && data.email) {
          setUser({ name: data.name, email: data.email });
        } else {
          setMessage(data.message);
        }
      } catch (err) {
        setMessage("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updateForm),
    });
    const data: ApiResponse = await res.json();
    setMessage(data.message);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: ApiResponse = await res.json();
    setMessage(data.message);
    if (res.ok) {
      localStorage.removeItem("token");
      router.push("/signup");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border">
              <p className="text-gray-700"><b>Name:</b> {user.name}</p>
              <p className="text-gray-700"><b>Email:</b> {user.email}</p>
            </div>
          )}

          <Separator />

          {/* Update Section */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Update Profile</h2>
            <div className="space-y-3">
              <div>
                <Label>New Name</Label>
                <Input name="name" onChange={handleChange} placeholder="Enter new name" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" name="password" onChange={handleChange} placeholder="Enter new password" />
              </div>
              <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div>
            <h2 className="font-semibold text-lg text-red-600 mb-3">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-2">Once deleted, your account cannot be recovered.</p>
            <Button onClick={handleDelete} variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>

          {message && <p className="text-sm text-center text-red-500">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
