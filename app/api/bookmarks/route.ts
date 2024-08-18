import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, url } = await req.json();

  if (!title || !url) {
    return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
  }

  const newBookmark = await db.bookmark.create({
    data: {
      title,
      url,
      userId: user.id,
    },
  });

  return NextResponse.json(newBookmark, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await db.bookmark.delete({
    where: { id },
  });

  return NextResponse.json({}, { status: 204 });
}
