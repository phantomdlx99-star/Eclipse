import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Classes from "@/lib/model/Class";

export async function POST(req: Request) {
  await dbConnect();
  const { classId } = await req.json();

  const subjects = await Classes.findOne({ slug: classId });

  return NextResponse.json(subjects);
}
