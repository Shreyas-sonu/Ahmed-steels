import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (optional security measure)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current time in IST
    const now = new Date();
    const istTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const currentHour = istTime.getHours();

    // Check if current time is 9 AM or 9 PM (with 1 hour tolerance)
    const isReminderTime =
      (currentHour >= 8 && currentHour <= 10) || // 9 AM ± 1 hour
      (currentHour >= 20 && currentHour <= 22); // 9 PM ± 1 hour

    if (!isReminderTime) {
      return NextResponse.json(
        {
          message: "Not reminder time yet",
          currentTime: istTime.toISOString(),
          currentHour,
        },
        { status: 200 }
      );
    }

    // Send reminder notification
    const response = await fetch(
      `${request.nextUrl.origin}/api/push/send-reminder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(
      {
        message: "Reminder cron job executed successfully",
        currentTime: istTime.toISOString(),
        currentHour,
        reminderResult: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reminder cron job:", error);
    return NextResponse.json(
      {
        error: "Failed to execute reminder cron job",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
