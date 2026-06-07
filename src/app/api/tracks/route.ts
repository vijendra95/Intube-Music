import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const artistId = searchParams.get('artistId');
    const albumId = searchParams.get('albumId');
    const genre = searchParams.get('genre');
    const published = searchParams.get('published');

    const mood = searchParams.get('mood');

    const where: Record<string, unknown> = {};
    if (artistId) where.artistId = artistId;
    if (albumId) where.albumId = albumId;
    if (genre) where.genre = genre;
    if (mood) where.mood = mood;
    if (published !== null) where.isPublished = published === 'true';

    const [tracks, total] = await Promise.all([
      prisma.track.findMany({
        where,
        include: { artist: true, album: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.track.count({ where }),
    ]);

    const serialized = tracks.map(t => ({
      ...t,
      playCount: Number(t.playCount),
      artist: t.artist ? { ...t.artist, totalStreams: Number(t.artist.totalStreams), monthlyListeners: Number(t.artist.monthlyListeners) } : null,
    }));
    return NextResponse.json({ tracks: serialized, total: Number(total), page, limit });
  } catch (error) {
    console.error('GET /api/tracks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artistId, albumId, duration, genre, mood, isExplicit, trackNumber, audioUrl, coverUrl, isPublished } = body;

    if (!title || !artistId) {
      return NextResponse.json({ error: 'Title and artistId are required' }, { status: 400 });
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) {
      return NextResponse.json({ error: `Artist not found (id: ${artistId}). Please refresh and select a valid artist.` }, { status: 400 });
    }

    const slug = slugify(title) + '-' + Date.now().toString(36);

    const track = await prisma.track.create({
      data: {
        title,
        slug,
        duration: duration || 0,
        artistId,
        albumId: albumId || null,
        genre: genre || null,
        mood: mood || null,
        isExplicit: isExplicit || false,
        trackNumber: trackNumber || 1,
        isPublished: isPublished !== undefined ? isPublished : true,
        audioOriginal: audioUrl || null,
        audioUrl128: audioUrl || null,
        audioUrl320: audioUrl || null,
        coverUrl: coverUrl || null,
      },
      include: { artist: true, album: true },
    });

    return NextResponse.json({ ...track, playCount: Number(track.playCount), artist: track.artist ? { ...track.artist, totalStreams: Number(track.artist.totalStreams) } : null }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tracks error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create track';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
