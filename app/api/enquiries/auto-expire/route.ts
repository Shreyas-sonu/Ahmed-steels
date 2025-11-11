import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Calculate date 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Update enquiries that are not attended and older than 2 days
    const { data, error } = await supabase
      .from("enquiries")
      .update({ attended: true })
      .lt("created_at", twoDaysAgo.toISOString())
      .eq("attended", false)
      .select();

    if (error) {
      console.error("Error auto-expiring enquiries:", error);
      return NextResponse.json(
        { error: "Failed to auto-expire enquiries" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Auto-expire completed successfully",
        expiredCount: data?.length || 0,
        expiredEnquiries: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in auto-expire:", error);
    return NextResponse.json(
      {
        error: "Failed to auto-expire enquiries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support GET for cron jobs
export async function GET(request: NextRequest) {
  return POST(request);
}
