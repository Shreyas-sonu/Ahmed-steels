// Utility functions for managing push notifications

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("Service Worker registered successfully:", registration);
        return registration;
      } catch (error) {
        console.error("Service Worker registration failed:", error);
        return null;
      }
    } else {
      console.log("Service Workers are not supported in this browser");
      return null;
    }
  };

export const subscribeToPushNotifications = async (
  deviceName?: string
): Promise<PushSubscription | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if notification permission is granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Notification permission denied");
        return null;
      }
    }

    // Get VAPID public key from environment
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error("VAPID public key not found");
      return null;
    }

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey as BufferSource,
    });

    // Send subscription to server
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        deviceName: deviceName || "Unknown Device",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save subscription to server");
    }

    console.log("Push subscription successful:", subscription);
    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
};

export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Unsubscribe from push notifications
      await subscription.unsubscribe();

      // Notify server
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });

      console.log("Push subscription cancelled successfully");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return false;
  }
};

export const isPushNotificationSupported = (): boolean => {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};

export const getPushSubscriptionStatus = async (): Promise<{
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
}> => {
  const isSupported = isPushNotificationSupported();

  if (!isSupported) {
    return {
      isSupported: false,
      isSubscribed: false,
      permission: "default",
    };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return {
      isSupported: true,
      isSubscribed: !!subscription,
      permission: Notification.permission,
    };
  } catch (error) {
    console.error("Error checking push subscription status:", error);
    return {
      isSupported: true,
      isSubscribed: false,
      permission: Notification.permission,
    };
  }
};
