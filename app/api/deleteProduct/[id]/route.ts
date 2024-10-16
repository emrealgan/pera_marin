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

    const uploadsDir = path.join(
      process.cwd(),
      "public",
      `uploads/${product.code}`
    );

    // Check if the uploads directory exists
    if (fs.existsSync(uploadsDir)) {
      // Remove the directory and all its contents
      fs.rmdirSync(uploadsDir, { recursive: true });
    }

    await Product.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({ message: "Product deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
