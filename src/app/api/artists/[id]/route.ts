import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Try by slug first, then by id
    let artist = await prisma.artist.findUnique({ where: { slug: id } });
    if (!artist) {
      artist = await prisma.artist.findUnique({ where: { id } });
    }
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...artist,
      totalStreams: Number(artist.totalStreams),
      monthlyListeners: Number(artist.monthlyListeners),
      genres: artist.genres ? (() => { try { return JSON.parse(artist.genres!); } catch { return []; } })() : [],
      socialLinks: artist.socialLinks ? (() => { try { return JSON.parse(artist.socialLinks!); } catch { return {}; } })() : {},
    });
  } catch (error) {
    console.error('GET /api/artists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, bio, country, genres, socialLinks, labelId } = body;

    const artist = await prisma.artist.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(country !== undefined && { country: country || null }),
        ...(genres !== undefined && { genres: genres ? JSON.stringify(genres) : null }),
        ...(socialLinks !== undefined && { socialLinks: socialLinks ? JSON.stringify(socialLinks) : null }),
        ...(labelId !== undefined && { labelId: labelId || null }),
      },
    });

    return NextResponse.json({ ...artist, totalStreams: Number(artist.totalStreams) });
  } catch (error) {
    console.error('PUT /api/artists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Delete related tracks first (cascade)
    await prisma.track.deleteMany({ where: { artistId: id } });
    // Delete related albums
    await prisma.album.deleteMany({ where: { artistId: id } });
    // Then delete the artist
    await prisma.artist.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/artists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete artist. It may have linked content.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
