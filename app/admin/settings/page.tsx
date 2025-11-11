"use client";

import AdminSidebar from "@/components/AdminSidebar";
import NotificationSettings from "@/components/NotificationSettings";
import { useAuth } from "@/context/AuthContext";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-gray-600 text-sm">
                Manage your admin panel preferences
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="max-w-3xl">
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
