import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json([]); // Return empty list if not logged in
    }

    await dbConnect();

    // Fetch chats for this user, sorted by newest first
    // .select() optimizes speed by only getting the ID and Title (not the big message arrays)
    const chats = await Chat.find({ userId })
      .select('_id title updatedAt') 
      .sort({ updatedAt: -1 });

    return NextResponse.json(chats);

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}