import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';
import { UTApi } from "uploadthing/server";


export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { bookmarkFileKeyUT: true },
    });

    if (!userData || !userData.bookmarkFileKeyUT) {
      return NextResponse.json({ error: 'File key not found' }, { status: 404 });
    }

    return NextResponse.json({ fileKey: userData.bookmarkFileKeyUT }, { status: 200 });
  } catch (error) {
    console.error('Error fetching file key:', error);
    return NextResponse.json({ error: 'Failed to fetch file key' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { bookmarkFileKeyUT: true },
    });

    if (!userData?.bookmarkFileKeyUT) {
      await db.user.update({
        where: { id: user.id },
        data: { bookmarkFileKeyUT: fileKey },
      });

      return NextResponse.json({ message: "Bookmark has been successfully updated" }, { status: 201 });
    }

    const utapi = new UTApi();

    const response = await utapi.deleteFiles(userData.bookmarkFileKeyUT);

    if(response.success) {
      await db.user.update({
      where: { id: user.id },
      data: { bookmarkFileKeyUT: fileKey },
    });
    }

    return NextResponse.json({ message: "Bookmark has been successfully updated." }, { status: 200 });
  } catch (error) {
    console.error('Error creating or updating bookmark');
    return NextResponse.json({ error: 'Failed to create or update bookmark' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { bookmarkFileKeyUT: true },
    });

    if (!userData?.bookmarkFileKeyUT) {
      return NextResponse.json({ error: 'File key not found' }, { status: 404 });
    }

    const utapi = new UTApi();

    const response = await utapi.deleteFiles(userData.bookmarkFileKeyUT);

    if(response) {
    await db.user.update({
      where: { id: user.id },
      data: { bookmarkFileKeyUT: null },
    });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting file key:', error);
    return NextResponse.json({ error: 'Failed to delete file key' }, { status: 500 });
  }
}
