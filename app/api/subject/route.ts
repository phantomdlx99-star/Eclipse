import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Classes, Subjects } from "@/lib/model/Class";

export async function POST(req: Request) {
  await dbConnect();
  const { classId } = await req.json();

  const selectedClass = await Classes.findOne({ slug: classId });

  const newSubject = await Subjects.findOne({
    classId: selectedClass._id,
  });
  return NextResponse.json(newSubject, {
    status: 201,
    statusText: "Successfully got the subject",
  });
}
