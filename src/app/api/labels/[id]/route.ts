import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, website, country } = body;

    const label = await prisma.label.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(website !== undefined && { website: website || null }),
        ...(country !== undefined && { country: country || null }),
      },
    });

    return NextResponse.json(label);
  } catch (error) {
    console.error('PUT /api/labels/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.label.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/labels/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
