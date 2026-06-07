import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    await prisma.artist.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/artists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
