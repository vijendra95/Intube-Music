import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // all, tracks, artists, albums, playlists
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
    }

    const searchFilter = { contains: query };
    const results: Record<string, unknown> = {};

    if (!type || type === 'all' || type === 'tracks') {
      results.tracks = await prisma.track.findMany({
        where: {
          OR: [
            { title: searchFilter },
            { artist: { name: searchFilter } },
          ],
          isPublished: true,
        },
        include: { artist: true, album: true },
        take: limit,
      });
    }

    if (!type || type === 'all' || type === 'artists') {
      results.artists = await prisma.artist.findMany({
        where: { name: searchFilter },
        take: limit,
      });
    }

    if (!type || type === 'all' || type === 'albums') {
      results.albums = await prisma.album.findMany({
        where: {
          OR: [
            { title: searchFilter },
            { artist: { name: searchFilter } },
          ],
          isPublished: true,
        },
        include: { artist: true },
        take: limit,
      });
    }

    if (!type || type === 'all' || type === 'playlists') {
      results.playlists = await prisma.playlist.findMany({
        where: {
          title: searchFilter,
          isPublic: true,
        },
        take: limit,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET /api/search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
