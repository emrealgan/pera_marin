import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/app/lib/db";
import { Product } from "@/app/lib/models";

export async function GET() {
  try {
    await connectDB();

    const allProducts = await Product.find({}).select('_id name brand code url');
    console.log("in the get api")
    return new NextResponse(JSON.stringify({ products: allProducts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Veritabanı sorgusu sırasında bir hata oluştu.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  finally{
    await disconnectDB()
  }
}
