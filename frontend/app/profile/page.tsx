"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UserProfile {
  name: string;
  email: string;
  role: "user" | "admin";
}

interface ApiResponse {
  message: string;
  name?: string;
  email?: string;
  role?: "user" | "admin";
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
          setUser({ 
            name: data.name, 
            email: data.email,
            role: data.role || "user"
          });
        } else {
          setMessage(data.message);
        }
      } catch {
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

  const handleAdminAccess = () => {
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="font-semibold text-lg mb-4">Profile Info</h2>
            <p className="text-gray-700 mb-2"><b>Name:</b> {user.name}</p>
            <p className="text-gray-700 mb-2"><b>Email:</b> {user.email}</p>
            <p className="text-gray-700 mb-2">
              <b>Role:</b>{" "}
              <span className={user.role === "admin" ? "text-green-600 font-medium" : ""}>
                {user.role}
              </span>
            </p>
          </div>
        )}

        {/* Admin Card */}
        {user?.role === "admin" && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="font-semibold text-lg mb-4 text-purple-600">Admin Access</h2>
            <Button 
              onClick={handleAdminAccess} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Admin Dashboard
            </Button>
          </div>
        )}

        {/* Update Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="font-semibold text-lg mb-4">Update Profile</h2>
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

        {/* Danger Zone Card */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="font-semibold text-lg text-red-600 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-2">Once deleted, your account cannot be recovered.</p>
          <Button onClick={handleDelete} variant="destructive" className="w-full">
            Delete Account
          </Button>
        </div>
      </div>

      {message && <p className="text-sm text-center text-red-500 mt-6">{message}</p>}
    </div>
  );
}
