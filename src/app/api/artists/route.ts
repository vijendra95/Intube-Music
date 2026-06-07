import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const where = search
      ? { name: { contains: search } }
      : {};

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        include: { label: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.artist.count({ where }),
    ]);

    const serialized = artists.map(a => ({ ...a, totalStreams: Number(a.totalStreams) }));
    return NextResponse.json({ artists: serialized, total: Number(total), page, limit });
  } catch (error) {
    console.error('GET /api/artists error:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bio, country, genres, socialLinks, labelId } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = slugify(name) + '-' + Date.now().toString(36);

    const artist = await prisma.artist.create({
      data: {
        name,
        slug,
        bio: bio || null,
        country: country || null,
        genres: genres ? JSON.stringify(genres) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        labelId: labelId || null,
      },
    });

    return NextResponse.json({ ...artist, totalStreams: Number(artist.totalStreams) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/artists error:', error);
    return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
