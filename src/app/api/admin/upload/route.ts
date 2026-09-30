import { NextRequest, NextResponse } from "next/server";
import { persistProductImageFile } from "@/lib/services/uploadService";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const productId = (formData.get("productId") as string) || "prod";

    const filesToUpload: File[] = [];
    if (singleFile && singleFile.size > 0) {
      filesToUpload.push(singleFile);
    }
    for (const f of files) {
      if (f && f.size > 0 && !filesToUpload.includes(f)) {
        filesToUpload.push(f);
      }
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image files provided." },
        { status: 400 }
      );
    }

    const results = [];
    for (const file of filesToUpload) {
      const result = await persistProductImageFile(file, productId);
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      data: results,
      // For convenience when single file uploaded
      url: results[0]?.url,
    });
  } catch (error: unknown) {
    console.error("[Upload API] Error processing file upload:", error);
    const message = error instanceof AppError ? error.message : (error as Error)?.message || "Failed to persist image.";
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
}
