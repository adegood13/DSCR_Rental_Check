import { NextResponse } from "next/server";
import { analyzeAddress } from "@/lib/analyze";
import { ProviderError } from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let address: string;
  try {
    const body = await request.json();
    address = typeof body?.address === "string" ? body.address.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!address) {
    return NextResponse.json(
      { error: "Please enter a property address." },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeAddress(address);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ProviderError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("[api/analyze] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong while analyzing that address." },
      { status: 500 }
    );
  }
}
