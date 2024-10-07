import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { tokenControl } from "@/app/lib/tokenControl";

export async function POST(req: NextRequest) {
  const uploadDir = path.join("/tmp", "uploads"); // Save files in the public directory served by your web server

  try {
    const response = await tokenControl(req);
    if (response) {
      return response;
    }

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();
    const file = formData.get("file");
    const code = formData.get("code");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${code}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Check if the file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { message: "Product code already exists" },
        { status: 400 }
      );
    } catch (err) {
      // File does not exist, proceed with the upload
    }

    // Convert the file to a buffer and write it to the /httpdocs/uploads directory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Serve file from the httpdocs/uploads directory, encode URL to handle special characters
    const fileUrl = `https://www.peramarin.com/uploads/${encodeURIComponent(uniqueFileName)}`;

    // Return the URL where the file is accessible
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
