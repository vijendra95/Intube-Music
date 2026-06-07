import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const moods = await prisma.mood.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json({ moods });
  } catch (error) {
    console.error('Error fetching moods:', error);
    return NextResponse.json({ moods: [] });
  }
}
