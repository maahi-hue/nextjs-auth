import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from "bcrypt";
import * as z from "zod";


//define a schema for input registration
const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })

export async function POST(req) {
   try{
       const body=await req.json();
       const {email, username, password} = userSchema.parse(body);


       // Check if the email already exists
         const existingUserByEmail = await db.user.findUnique({
              where: {
                email: email,
              },
         });
            if (existingUserByEmail) {
                return NextResponse.json({ user: null, message:"Email already exists"}, {status: 409});
            }
            // Check if the username already exists
            const existingUserByUsername = await db.user.findUnique({
                where: {
                    username: username,
                },
            });
            if (existingUserByUsername) {
                return NextResponse.json({ user: null, message:"Username already exists"}, {status: 409});
            }
            const hashedPassword = await hash(password, 10);
            // Create the user
            const newUser = await db.user.create({
                data: {
                    email: email,
                    username: username,
                    password: hashedPassword,
                },
            });

            const {password: newUserPassword, ...rest} = newUser;

       return NextResponse.json({user: rest, message:"User created successfully"}, {status: 200});
} catch(error){
    console.error("API /api/user error:", error);
    return NextResponse.json({message:"Internal server error"}, {status: 500});
  }
  
}