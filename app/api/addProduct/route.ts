import { NextRequest, NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/app/lib/db";
import { Product } from "@/app/lib/models";
import { tokenControl } from "@/app/lib/tokenControl";

export async function POST(req: NextRequest) {
  const response = await tokenControl(req);
  if (response) {
    return response;
  }
  const body = await req.json();
  const { name, brand, code, url } = body;

  if (!name || !brand || !code || !url) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    console.log("Connected to DB");

    const newProduct = new Product({
      brand,
      name,
      code,
      urls: url,
    });

    const result = await newProduct.save();
    console.log("Product added:", result);

    return new NextResponse(JSON.stringify({ data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error adding product:", error);

    return NextResponse.json(
      {
        message: "Error adding product",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
    console.log("Disconnected from DB");
  }
}
