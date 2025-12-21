import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';

// 1. Change the second argument to 'props'
export async function GET(req, props) {
  try {
    // 2. Await the params object before using it
    const params = await props.params; 
    
    const { userId } = await auth();
    
    // --- DEBUG LOGS ---
    console.log("--------------------------------");
    console.log("DEBUG: Fetching Single Chat");
    console.log("Requested ID:", params.id); // This will now be correct
    console.log("User ID:", userId);
    // ------------------

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 3. Use the awaited params.id
    const chat = await Chat.findOne({ _id: params.id, userId });
    
    console.log("Chat Found?", !!chat);
    console.log("--------------------------------");

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}