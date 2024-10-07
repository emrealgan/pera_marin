import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { tokenControl } from "@/app/lib/tokenControl";

export async function POST(req: NextRequest) {
  const uploadDir = path.join("/tmp", "uploads");

  try {
    const response = await tokenControl(req);
    if (response) {
      return response;
    }
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

    // Check if the file already exists in the temp directory
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { message: "Product code already exists" },
        { status: 400 }
      );
    } catch (err) {
      // File does not exist, proceed with the upload
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // After upload, you can either move the file to the public directory 
    // or serve it from the temp directory (depending on your setup)

    // Here is an example of moving to public/uploads (update path as needed)
    const publicUploadDir = path.join(__dirname, "public", "uploads");
    await fs.mkdir(publicUploadDir, { recursive: true }); // Ensure public upload directory exists
    const finalFilePath = path.join(publicUploadDir, uniqueFileName);
    await fs.rename(filePath, finalFilePath); // Move the file to the public directory

    // Use encodeURIComponent to encode the filename for the URL
    const fileUrl = `/uploads/${encodeURIComponent(uniqueFileName)}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
