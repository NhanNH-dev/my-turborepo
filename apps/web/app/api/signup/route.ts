import { NextResponse } from "next/server";
import User from "../../lib/models/User";
import connectToDatabase from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export async function POST(request: any) {
  try {
    const { name, email, provider, password } = await request.json();
    let hashedPassword = null;
    if(provider !== 'google' && password) {
      hashedPassword = await bcrypt.hash(password, 10);
      
    }
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    await User.create({ name, email, provider, password: hashedPassword });

    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while register the user.",
      },
      { status: 500 }
    );
  }
}
