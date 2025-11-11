import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, deviceName } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    // Extract keys from subscription
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("endpoint", endpoint)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from("push_subscriptions")
        .update({
          p256dh,
          auth,
          device_name: deviceName,
          is_active: true,
        })
        .eq("endpoint", endpoint);

      if (updateError) {
        console.error("Error updating subscription:", updateError);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from("push_subscriptions")
        .insert([
          {
            endpoint,
            p256dh,
            auth,
            device_name: deviceName,
            is_active: true,
          },
        ]);

      if (insertError) {
        console.error("Error creating subscription:", insertError);
        return NextResponse.json(
          { error: "Failed to create subscription" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Subscription saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      {
        error: "Failed to save subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .update({ is_active: false })
      .eq("endpoint", endpoint);

    if (error) {
      console.error("Error deactivating subscription:", error);
      return NextResponse.json(
        { error: "Failed to deactivate subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Subscription deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deactivating subscription:", error);
    return NextResponse.json(
      {
        error: "Failed to deactivate subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
