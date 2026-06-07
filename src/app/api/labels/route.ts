import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [labels, total] = await Promise.all([
      prisma.label.findMany({
        include: { _count: { select: { artists: true, albums: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.label.count(),
    ]);

    return NextResponse.json({ labels, total: Number(total), page, limit });
  } catch (error) {
    console.error('GET /api/labels error:', error);
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, website, country, founded } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = slugify(name) + '-' + Date.now().toString(36);

    const label = await prisma.label.create({
      data: {
        name,
        slug,
        description: description || null,
        website: website || null,
        country: country || null,
        founded: founded ? parseInt(founded) : null,
      },
    });

    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error('POST /api/labels error:', error);
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
