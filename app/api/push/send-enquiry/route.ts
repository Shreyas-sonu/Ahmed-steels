import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// Configure web-push with VAPID keys
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  "mailto:mohammedtahirsteel@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enquiry } = body;

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry data is required" },
        { status: 400 }
      );
    }

    // Get all active push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("is_active", true);

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { message: "No active subscriptions found" },
        { status: 200 }
      );
    }

    // Get the base URL for absolute icon paths
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://ahmed-steels.vercel.app";

    // Prepare notification payload
    const notificationPayload = JSON.stringify({
      title: "🔔 New Enquiry Received!",
      body: `${enquiry.name} from ${enquiry.place}`,
      icon: `${baseUrl}/logo.png`,
      badge: `${baseUrl}/badge-72x72.png`,
      tag: "new-enquiry",
      data: {
        url: "/admin/enquiries",
        enquiryId: enquiry.id,
      },
    });

    // Send notification to all active subscriptions
    const sendPromises = subscriptions.map(async sub => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        await webpush.sendNotification(pushSubscription, notificationPayload);
        return { success: true, deviceName: sub.device_name };
      } catch (error: any) {
        console.error(`Error sending to ${sub.device_name}:`, error);

        // If subscription is invalid, mark it as inactive
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .update({ is_active: false })
            .eq("id", sub.id);
        }

        return {
          success: false,
          deviceName: sub.device_name,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.success).length;

    return NextResponse.json(
      {
        message: `Push notifications sent to ${successCount} device(s)`,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending push notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to send push notifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
