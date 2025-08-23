import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <section className="text-center mt-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
          Welcome to <span className="text-indigo-600">User Management</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Manage your users with ease — create accounts, log in securely, and
          update profiles effortlessly.
        </p>
      </section>

      <Card className="w-full max-w-md shadow-2xl border border-gray-200 mt-12">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Get Started
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/signup">
            <Button className="w-full">Signup</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="w-full">Login</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full">Profile</Button>
          </Link>
        </CardContent>
      </Card>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        Made by Sabir ali
      </footer>
    </div>
  );
}
