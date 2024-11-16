import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { updatedFavourites } = await req.json();

    if (!updatedFavourites || !Array.isArray(updatedFavourites)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updated = await Promise.all(
      updatedFavourites.map(({ url, order }: { url: string; order: number }) =>
        db.favourite.update({
            where: {
                url_userId: {
                  url,
                  userId: user.id,
                },
              },
          data: { order },
        })
      )
    );

    return NextResponse.json({ message: 'Favourites reordered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating favourites order:', error);
    return NextResponse.json({ error: 'Failed to reorder favourites' }, { status: 500 });
  }
}
