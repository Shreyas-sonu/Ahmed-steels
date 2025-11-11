"use client";

import NotificationSettings from "@/components/NotificationSettings";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your admin panel preferences
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
