import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@intubemusic.com' },
    update: {},
    create: {
      email: 'admin@intubemusic.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create test label
  const label = await prisma.label.upsert({
    where: { slug: 'intube-records' },
    update: {},
    create: {
      name: 'Intube Records',
      slug: 'intube-records',
      description: 'Official Intube Music label',
      country: 'India',
    },
  });
  console.log('Label created:', label.name);

  // Create test artist
  const artist = await prisma.artist.upsert({
    where: { slug: 'test-artist' },
    update: {},
    create: {
      name: 'Test Artist',
      slug: 'test-artist',
      bio: 'A test artist for the platform',
      country: 'India',
      labelId: label.id,
    },
  });
  console.log('Artist created:', artist.name);

  // Create genres
  const genres = ['Bollywood', 'Pop', 'Hip Hop', 'Classical', 'Devotional', 'Folk', 'Sufi', 'Rock', 'Electronic', 'Indie', 'Punjabi', 'Haryanvi', 'Rajasthani', 'Bhojpuri', 'Ghazal', 'Lo-Fi'];
  for (const name of genres) {
    await prisma.genre.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }
  console.log('Genres created:', genres.length);

  // Create moods
  const moods = ['Happy', 'Sad', 'Romantic', 'Party', 'Chill', 'Focus', 'Workout', 'Sleep', 'Energetic', 'Melancholy', 'Peaceful', 'Angry'];
  for (const name of moods) {
    await prisma.mood.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: {
        name,
        slug: name.toLowerCase(),
      },
    });
  }
  console.log('Moods created:', moods.length);

  console.log('\nSeed complete! Admin login: admin@intubemusic.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
