import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, imageUrl, linkUrl, linkType, isActive } = body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle: subtitle || null }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl: linkUrl || null }),
        ...(linkType !== undefined && { linkType: linkType || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('PUT /api/banners/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/banners/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
