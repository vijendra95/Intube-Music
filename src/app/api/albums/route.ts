import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const artistId = searchParams.get('artistId');

    const where: Record<string, unknown> = {};
    if (artistId) where.artistId = artistId;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where,
        include: { artist: true, label: true, _count: { select: { tracks: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.album.count({ where }),
    ]);

    return NextResponse.json({ albums, total: Number(total), page, limit });
  } catch (error) {
    console.error('GET /api/albums error:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artistId, labelId, type, genre, releaseDate, isExplicit, description, artwork } = body;

    if (!title || !artistId) {
      return NextResponse.json({ error: 'Title and artistId are required' }, { status: 400 });
    }

    const slug = slugify(title) + '-' + Date.now().toString(36);

    const album = await prisma.album.create({
      data: {
        title,
        slug,
        artistId,
        labelId: labelId || null,
        type: type || 'ALBUM',
        genre: genre || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        isExplicit: isExplicit || false,
        description: description || null,
        artwork: artwork || null,
        isPublished: true,
      },
      include: { artist: true, label: true },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error('POST /api/albums error:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
