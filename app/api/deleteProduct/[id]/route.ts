import { NextRequest, NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/app/lib/db";
import { Product } from "@/app/lib/models";
import fs from "fs";
import path from "path";
import { tokenControl } from "@/app/lib/tokenControl";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await tokenControl(req);
  if (response) {
    return response;
  }
  const { id } = params;

  try {
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    const files = fs.readdirSync(uploadsDir);
    const imageFile = files.find(
      (file) => path.basename(file, path.extname(file)) === product.code
    );

    if (imageFile) {
      const imagePath = path.join(uploadsDir, imageFile);

      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the product" },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}
