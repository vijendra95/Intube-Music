import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('GET /api/banners error:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, linkUrl, linkType } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const maxPos = await prisma.banner.aggregate({ _max: { position: true } });
    const nextPosition = (maxPos._max.position || 0) + 1;

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl,
        linkUrl: linkUrl || null,
        linkType: linkType || null,
        position: nextPosition,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('POST /api/banners error:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
