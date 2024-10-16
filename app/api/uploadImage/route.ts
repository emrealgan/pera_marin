import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { tokenControl } from "@/app/lib/tokenControl";

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    const response = await tokenControl(req);
    if (response) {
      return response;
    }

    const formData = await req.formData();
    const files = formData.getAll("file");
    const code = formData.get("code");

    if (!files || !files.length || !code) {
      return NextResponse.json(
        { error: "No files or code provided" },
        { status: 400 }
      );
    }

    // Ensure all uploaded items are files
    const validFiles = files.filter((file) => file instanceof File);
    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: "Invalid file(s) uploaded" },
        { status: 400 }
      );
    }

    const codeDir = path.join(uploadDir, code as string);

    // Create the directory for the product if it doesn't exist
    await fs.mkdir(codeDir, { recursive: true });

    // Array to hold the URLs of the uploaded files
    const uploadedFileUrls = [];

    // Loop through each file and save it sequentially
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i] as File;
      const fileExtension = path.extname(file.name);
      const uniqueFileName = `${i}${fileExtension}`;
      const filePath = path.join(codeDir, uniqueFileName);

      // Check if the file already exists
      try {
        await fs.access(filePath);
        return NextResponse.json(
          { message: `File already exists at ${filePath}` },
          { status: 400 }
        );
      } catch (err) {
        // File does not exist, proceed with the upload
      }

      // Convert the file to a buffer and write it to the code subdirectory
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      // Store the URL of the uploaded file
      const fileUrl = `/uploads/${code}/${uniqueFileName}`;
      uploadedFileUrls.push(fileUrl);
    }

    // Return the list of uploaded file URLs
    return NextResponse.json({ urls: uploadedFileUrls }, { status: 200 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
