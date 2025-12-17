// route.ts (No changes needed, but showing for context)

import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Classes from "@/lib/model/Class";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Good practice: wrap database operations in try...catch
    const {
      classId,
      slug,
      subjects,
      color,
      features,
      subtitle,
      title,
      gradeNumber,
    } = await req.json();

    const payLoad = {
      classId,
      slug,
      subjects,
      color,
      features,
      subtitle,
      title,
      gradeNumber,
    };

    const newClass = await Classes.create(payLoad);

    return NextResponse.json(newClass, {
      status: 201,
      statusText: "Successfully created the class!",
    });
  } catch (error) {
    // This is crucial for debugging 500 errors.
    console.error("Error creating new class:", error);
    return NextResponse.json(
      { error: "Failed to create class", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const classes = await Classes.find().sort({ gradeNumber: 1 }).exec();
  revalidatePath("/learn");
  return NextResponse.json(classes);
}
