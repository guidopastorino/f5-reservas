import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Ruta para obtener todas las reviews
export async function GET(req: Request) {
  try {
    await dbConnect();

    const reviews = await Review.find();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Ruta para crear una review
export async function POST(req: Request, res: Response) {
  try {
    const { fullname, username, review, stars } = await req.json();

    await dbConnect();

    // Verificar si el usuario ya tiene una review
    const existingReview = await Review.findOne({ username });
    
    if (existingReview) {
      return NextResponse.json({ message: "El usuario ya tiene una reseña hecha" }, { status: 400 });
    }

    // Validación de estrellas
    if (stars) {
      if (stars < 0 || stars > 5) {
        return NextResponse.json({ message: "Las calificaciones deben ser entre 0 y 5 estrellas" }, { status: 400 });
      }
    }

    const newReview = new Review({
      fullname,
      username,
      review,
      stars,
    });

    await newReview.save();

    return NextResponse.json({ message: "Review creada con éxito" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Ruta para eliminar todas las reviews
export async function DELETE(req: Request) {
  try {
    await dbConnect();

    // Eliminar todas las reviews de la base de datos
    await Review.deleteMany({});

    return NextResponse.json({ message: "Todas las reviews eliminadas con éxito" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
