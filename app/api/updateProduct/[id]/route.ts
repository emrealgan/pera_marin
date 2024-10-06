import { NextRequest, NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/app/lib/db";
import { Product } from "@/app/lib/models";
import fs from "fs";
import path from "path";
import { tokenControl } from "@/app/lib/tokenControl";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await tokenControl(req);
  if (response) {
    return response;
  }
  const { id } = params;
  const { name, brand, code, url } = await req.json(); // Adjusted to match your data

  try {
    await connectDB();

    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const oldCode = existingProduct.code;
    const oldUrl = existingProduct.url;
    const oldExtension = oldUrl ? path.extname(oldUrl) : "";
    const oldImagePath = oldUrl
      ? path.join(
          process.cwd(),
          "public",
          "uploads",
          `${oldCode}${oldExtension}`
        )
      : null;

    // Determine new extension from the URL if needed
    const newExtension = url ? path.extname(url) : oldExtension;

    // Handle old image renaming if the code has changed
    if (oldCode !== code) {
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        const newImagePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          `${code}${newExtension}`
        );
        fs.renameSync(oldImagePath, newImagePath);
        console.log(`Renamed old image to: ${newImagePath}`);
      }
    }

    // Handle new image upload if URL is different
    if (url !== oldUrl) {
      // Delete the old image if it exists
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log(`Deleted old image: ${oldImagePath}`);
      }
    }

    const fileUrl = `/uploads/${code}${newExtension}`;

    // Update the product with the new information
    const result = await Product.findByIdAndUpdate(id, {
      name,
      brand,
      code,
      url: fileUrl,
    });

    return NextResponse.json({
      message: "Product updated successfully",
      product: result,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the product" },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}
