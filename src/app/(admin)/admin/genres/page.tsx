'use client';

import { useState } from 'react';

const defaultGenres = [
  'Bollywood', 'Pop', 'Hip Hop', 'Classical', 'Devotional', 'Folk', 'Sufi',
  'Rock', 'Electronic', 'Indie', 'Punjabi', 'Haryanvi', 'Rajasthani',
  'Bhojpuri', 'Ghazal', 'Lo-Fi', 'R&B', 'Jazz', 'Metal', 'Acoustic',
];

const defaultMoods = [
  'Happy', 'Sad', 'Romantic', 'Party', 'Chill', 'Focus', 'Workout',
  'Sleep', 'Energetic', 'Melancholy', 'Peaceful', 'Angry', 'Nostalgic',
];

export default function GenresMoodsPage() {
  const [genreName, setGenreName] = useState('');
  const [moodName, setMoodName] = useState('');
  const [genres, setGenres] = useState<string[]>(defaultGenres);
  const [moods, setMoods] = useState<string[]>(defaultMoods);

  const addGenre = () => {
    if (genreName && !genres.includes(genreName)) {
      setGenres([...genres, genreName]);
      setGenreName('');
    }
  };

  const addMood = () => {
    if (moodName && !moods.includes(moodName)) {
      setMoods([...moods, moodName]);
      setMoodName('');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Genres & Moods</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genres */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Genres</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
              placeholder="Add genre..."
              className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button
              onClick={addGenre}
              className="px-4 py-2 bg-[var(--color-primary)] text-black font-medium text-sm rounded-lg hover:bg-[var(--color-primary-hover)]"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-full text-sm text-white flex items-center gap-2"
              >
                {genre}
                <button
                  onClick={() => setGenres(genres.filter((g) => g !== genre))}
                  className="text-[#8888aa] hover:text-red-400 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Moods */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Moods</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={moodName}
              onChange={(e) => setMoodName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMood())}
              placeholder="Add mood..."
              className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button
              onClick={addMood}
              className="px-4 py-2 bg-[var(--color-primary)] text-black font-medium text-sm rounded-lg hover:bg-[var(--color-primary-hover)]"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <span
                key={mood}
                className="px-3 py-1.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-full text-sm text-white flex items-center gap-2"
              >
                {mood}
                <button
                  onClick={() => setMoods(moods.filter((m) => m !== mood))}
                  className="text-[#8888aa] hover:text-red-400 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
