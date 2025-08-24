"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner"; 

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updateForm, setUpdateForm] = useState<{ name?: string; email?: string; role?: string }>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchUsers = async (pageNumber = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        router.push("/login");
        return;
      }
    } catch (err) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    fetchUsers(page);
  }, [page, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUpdateForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!editingUser || !token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateForm),
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(users.map(u => (u._id === editingUser._id ? { ...u, ...updateForm } as User : u)));
        setEditingUser(null);

        toast.success("User updated successfully");
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating user");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        toast.success("User deleted successfully ");
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gray-50 p-6 space-y-6">
      <Card className="w-full max-w-4xl shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-600">Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {users.length === 0 && <p>No users found.</p>}

          {users.map(user => (
            <div key={user._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 mb-3 bg-gray-50 rounded border">
              <div className="flex-1">
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <Dialog open={editingUser?._id === user._id} onOpenChange={(open) => !open && setEditingUser(null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>
                        Update the user details and click save when done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label>Name</Label>
                        <Input name="name" value={updateForm.name || ""} onChange={handleChange} />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input name="email" value={updateForm.email || ""} onChange={handleChange} />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <select name="role" value={updateForm.role || "user"} onChange={handleChange} className="border rounded p-2 w-full">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleUpdate}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id)}>Delete</Button>
              </div>
            </div>
          ))}

          <div className="flex justify-center space-x-2 mt-4">
            <Button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Previous</Button>
            <span className="px-3 py-1 bg-gray-200 rounded">{page} / {totalPages}</span>
            <Button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
