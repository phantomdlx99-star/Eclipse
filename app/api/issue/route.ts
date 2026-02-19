import { Issue } from "@/lib/model/issue";
import { connectToDB } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const { question, issue } = await req.json();

    if (!question || !issue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newIssue = await Issue.create({
      question,
      issue,
      clerkId: userId,
    });

    console.log("Issue reported:", newIssue._id);

    return NextResponse.json({
      message:
        "Your issue has been reported successfully! We'll take action on it as soon as possible.",
    });
  } catch (error: any) {
    console.error("Error reporting issue:", error);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong. Please try again later",
      },
      { status: 500 },
    );
  }
}
