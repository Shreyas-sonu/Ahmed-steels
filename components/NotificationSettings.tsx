"use client";

import {
  getPushSubscriptionStatus,
  registerServiceWorker,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/push-notifications";
import { Bell, BellOff, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  const [deviceName, setDeviceName] = useState("");

  useEffect(() => {
    checkNotificationStatus();
    registerServiceWorker();
  }, []);

  const checkNotificationStatus = async () => {
    const status = await getPushSubscriptionStatus();
    setIsSupported(status.isSupported);
    setIsSubscribed(status.isSubscribed);
    setPermission(status.permission);
  };

  const handleSubscribe = async () => {
    if (!deviceName.trim()) {
      toast.error("Please enter a device name");
      return;
    }

    setLoading(true);
    try {
      const subscription = await subscribeToPushNotifications(deviceName);
      if (subscription) {
        toast.success("Successfully subscribed to notifications!");
        await checkNotificationStatus();
      } else {
        toast.error("Failed to subscribe to notifications");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to subscribe to notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm("Are you sure you want to unsubscribe from notifications?")) {
      return;
    }

    setLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        toast.success("Successfully unsubscribed from notifications");
        await checkNotificationStatus();
      } else {
        toast.error("Failed to unsubscribe from notifications");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error("Failed to unsubscribe from notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (!isSubscribed) {
      toast.error("Please subscribe to notifications first");
      return;
    }

    try {
      if (Notification.permission === "granted") {
        new Notification("Test Notification", {
          body: "This is a test notification from Ahmed Steels",
          icon: "/android/android-launchericon-192-192.png",
          badge: "/badge-72x72.png",
        });
        toast.success("Test notification sent!");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification");
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <BellOff className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-yellow-900">
              Push Notifications Not Supported
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your browser doesn&apos;t support push notifications. Please use a
              modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-primary-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Push Notifications
          </h2>
          <p className="text-sm text-gray-600">
            Receive notifications for new enquiries and sales reminders
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Notification Status</div>
            <div className="text-sm text-gray-600 mt-1">
              Permission:{" "}
              <span className="font-medium capitalize">{permission}</span>
            </div>
          </div>
          <div>
            {isSubscribed ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Bell className="w-4 h-4" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                <BellOff className="w-4 h-4" />
                Inactive
              </span>
            )}
          </div>
        </div>

        {!isSubscribed ? (
          <>
            {/* Subscribe Form */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Device Name
                </span>
                <div className="mt-1 relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={deviceName}
                    onChange={e => setDeviceName(e.target.value)}
                    placeholder="e.g., Owner's Phone, Admin Tablet"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </label>

              <button
                onClick={handleSubscribe}
                disabled={loading || !deviceName.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing..." : "Enable Notifications"}
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                What you&apos;ll receive:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Instant notifications when new enquiries are submitted
                </li>
                <li>• Daily reminders at 9 AM and 9 PM IST to review sales</li>
                <li>• Important updates about your business</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Active Subscription */}
            <div className="space-y-3">
              <button
                onClick={handleTestNotification}
                className="w-full px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium hover:bg-primary-200 transition-colors"
              >
                Send Test Notification
              </button>

              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Unsubscribing..." : "Disable Notifications"}
              </button>
            </div>
          </>
        )}

        {/* Reminder Schedule */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Reminder Schedule (IST)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">9:00 AM</div>
              <div className="text-sm text-orange-700">Morning Reminder</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">9:00 PM</div>
              <div className="text-sm text-purple-700">Evening Reminder</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
