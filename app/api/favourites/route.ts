import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favourites = await db.favourite.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(favourites);
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return NextResponse.json({ error: 'Failed to fetch favourites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url } = await req.json();

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    const favouritesCount = await db.favourite.count({
      where: { userId: user.id },
    });

    if (favouritesCount >= 20) {
      return NextResponse.json({ error: 'Favorite limit reached' }, { status: 400 });
    }

    const newFavourite = await db.favourite.create({
      data: {
        title,
        url,
        userId: user.id,
      },
    });

    return NextResponse.json(newFavourite, { status: 201 });
  } catch (error) {
    console.error('Error creating favourite:', error);
    return NextResponse.json({ error: 'Failed to create favourite' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, url } = await req.json();

    if (!id && !title && !url) {
      return NextResponse.json({ error: 'ID, Title and URL are required' }, { status: 400 });
    }

    const updatedData: { title?: string; url?: string } = {};
    if (title) updatedData.title = title;
    if (url) updatedData.url = url;

    const updatedFavourite = await db.favourite.update({
      where: { id },
      data: updatedData,
      select: {
        id: true,
        title: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedFavourite, { status: 200 });
  } catch (error) {
    console.error('Error updating favourite:', error);
    return NextResponse.json({ error: 'Failed to update favourite' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const favourite = await db.favourite.findUnique({
      where: { id },
    });

    if (!favourite) {
      return NextResponse.json({ error: 'Favourite not found' }, { status: 404 });
    }

    await db.favourite.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting favourite:', error);
    return NextResponse.json({ error: 'Failed to delete favourite' }, { status: 500 });
  }
}
