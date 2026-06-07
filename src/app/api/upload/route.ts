import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'audio' | 'image' | 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedAudio = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/aac', 'audio/mp4'];
    const allowedImage = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideo = ['video/mp4', 'video/webm'];

    let allowed: string[];
    let folder: string;

    switch (type) {
      case 'audio':
        allowed = allowedAudio;
        folder = 'audio';
        break;
      case 'image':
        allowed = allowedImage;
        folder = 'images';
        break;
      case 'video':
        allowed = allowedVideo;
        folder = 'videos';
        break;
      default:
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: `Invalid ${type} format. Allowed: ${allowed.join(', ')}` }, { status: 400 });
    }

    // Max file sizes
    const maxSizes: Record<string, number> = {
      audio: 100 * 1024 * 1024, // 100MB
      image: 10 * 1024 * 1024,  // 10MB
      video: 500 * 1024 * 1024, // 500MB
    };

    if (file.size > maxSizes[type]) {
      return NextResponse.json({ error: `File too large. Max: ${maxSizes[type] / 1024 / 1024}MB` }, { status: 400 });
    }

    // Upload to Vercel Blob Storage
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
