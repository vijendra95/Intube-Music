'use client';

import { useState } from 'react';

export default function AlbumsPage() {
  const [albums] = useState<Array<{ id: string; title: string; artist: string; type: string; tracks: number; published: boolean }>>([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Albums & Releases</h1>
          <p className="text-[#8888aa] text-sm mt-1">View all albums, singles, and EPs</p>
        </div>
        <a
          href="/admin/upload"
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Upload New Release
        </a>
      </div>

      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
        {albums.length === 0 ? (
          <div className="text-center py-16 text-[#8888aa]">
            <p className="text-5xl mb-4">💿</p>
            <p className="text-lg font-medium">No albums yet</p>
            <p className="text-sm mt-1">Upload music to create albums</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#2a2a4a]">
              <tr className="text-left text-xs text-[#8888aa] uppercase">
                <th className="px-6 py-3">Album</th>
                <th className="px-6 py-3">Artist</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Tracks</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album) => (
                <tr key={album.id} className="border-b border-[#2a2a4a] hover:bg-[#2a2a4a]/50">
                  <td className="px-6 py-4 text-white font-medium">{album.title}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{album.artist}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{album.type}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{album.tracks}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${album.published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {album.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-[var(--color-primary)] hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
