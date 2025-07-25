import { NextRequest, NextResponse } from "next/server";
import {
  updatePost,
  deletePost,
  getPostForEditing,
} from "@/lib/supabase-dashboard-queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostForEditing(id);

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data: post, error } = await updatePost(id, body);

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
      const { error } = await deletePost(id);

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
