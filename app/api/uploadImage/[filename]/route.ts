import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  const filePath = path.join("/tmp", "uploads", filename);

  try {
    const file = await fs.readFile(filePath);
    const extension = path.extname(filename).toLowerCase();

    let contentType = "application/octet-stream"; // Default content type

    // Set the appropriate content type based on the file extension
    switch (extension) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      // Add more content types as needed
    }

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
