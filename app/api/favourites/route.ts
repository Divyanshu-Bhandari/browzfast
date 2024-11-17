import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';
import { initialUser } from '@/lib/initial-user';

export async function GET(req: NextRequest) {
  try {
    const initializedUser = await initialUser();
    const user = await currentUser();
    

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favourites = await db.favourite.findMany({
      where: { userId: user.id },
      select: {
        title: true,
        url: true,
        order: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ],
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
        userId: user.id
      },
      select: {
        title: true,
        url: true
      }
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

    const { title, url, oldUrl } = await req.json();

    if (!title && !url && !oldUrl) {
      return NextResponse.json({ error: 'Title, URL, Old URL are required' }, { status: 400 });
    }

    const updatedData: { title?: string; url?: string } = {};
    if (title) updatedData.title = title;
    if (url) updatedData.url = url;

    const updatedFavourite = await db.favourite.update({
      where: {
        url_userId: {
          url: oldUrl,
          userId: user.id,
        },
      },
      data: updatedData,
      select: {
        title: true,
        url: true,
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
    const favouriteUrl = url.searchParams.get('url');
    
    if (!favouriteUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const userId = user.id;

    const favourite = await db.favourite.findUnique({
      where: {
        url_userId: {
          url: favouriteUrl,
          userId: userId,
        },
      },
    });

    if (!favourite) {
      return NextResponse.json({ error: 'Favourite not found' }, { status: 404 });
    }

    await db.favourite.delete({
      where: {
        url_userId: {
          url: favouriteUrl,
          userId: userId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting favourite:', error);
    return NextResponse.json({ error: 'Failed to delete favourite' }, { status: 500 });
  }
}