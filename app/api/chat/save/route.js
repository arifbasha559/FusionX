import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
// Note: We do NOT import Message anymore!

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Get the data
    const { chatId, messages, model, title } = await req.json();

    // 2. Save EVERYTHING to the Chat Collection
    // The $set operator will overwrite the old 'messages' array with the new one
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { 
        $set: { 
          userId: userId,
          title: title,
          model: model,
          messages: messages // <--- Directly storing the array here
        } 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Success: Chat and Messages saved together");
    return NextResponse.json({ success: true, chatId: chat._id });

  } catch (error) {
    console.error("❌ Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}