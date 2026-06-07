import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Save to local uploads directory (in production, use S3/R2)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
