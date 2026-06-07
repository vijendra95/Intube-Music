import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, artistId, albumId, genre, mood, isExplicit, isPublished } = body;

    const track = await prisma.track.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(artistId !== undefined && { artistId }),
        ...(albumId !== undefined && { albumId: albumId || null }),
        ...(genre !== undefined && { genre: genre || null }),
        ...(mood !== undefined && { mood: mood || null }),
        ...(isExplicit !== undefined && { isExplicit }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: { artist: true, album: true },
    });

    return NextResponse.json({ ...track, playCount: Number(track.playCount) });
  } catch (error) {
    console.error('PUT /api/tracks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update track' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.track.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tracks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
