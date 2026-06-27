import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      const indexPath = path.join(process.cwd(), "data", "curriculum-index.json");
      const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      return NextResponse.json({ index });
    }

    const lessonPath = path.join(process.cwd(), "data", `${id}.json`);
    if (!fs.existsSync(lessonPath)) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lesson = JSON.parse(fs.readFileSync(lessonPath, "utf8"));
    return NextResponse.json({ lesson });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}