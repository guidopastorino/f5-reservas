import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

// Obtener una review
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Review ID no válido" }, { status: 400 });
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ message: "Review no encontrada" }, { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Actualizar una review
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { review, stars } = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Review ID no válido" }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(id, { review, stars }, { new: true });

    if (!updatedReview) {
      return NextResponse.json({ message: "Review no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Eliminar una review
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Review ID no válido" }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ message: "Review no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review eliminada con éxito" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}