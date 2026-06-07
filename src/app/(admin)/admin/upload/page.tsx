'use client';

import { useState, useEffect } from 'react';

interface TrackUpload {
  title: string;
  trackNumber: number;
  file: File | null;
  isExplicit: boolean;
}

interface ArtistOption { id: string; name: string; }
interface LabelOption { id: string; name: string; }

export default function UploadMusicPage() {
  const [uploadType, setUploadType] = useState<'single' | 'album' | 'ep'>('single');
  const [albumTitle, setAlbumTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [labelId, setLabelId] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackUpload[]>([{ title: '', trackNumber: 1, file: null, isExplicit: false }]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [labels, setLabels] = useState<LabelOption[]>([]);

  useEffect(() => {
    fetch('/api/artists').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.artists || []);
      setArtists(list);
    }).catch(() => {});
    fetch('/api/labels').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.labels || []);
      setLabels(list);
    }).catch(() => {});
  }, []);

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtwork(file);
      const reader = new FileReader();
      reader.onload = (ev) => setArtworkPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTrack = () => {
    setTracks([...tracks, { title: '', trackNumber: tracks.length + 1, file: null, isExplicit: false }]);
  };

  const removeTrack = (index: number) => {
    if (tracks.length > 1) {
      setTracks(tracks.filter((_, i) => i !== index));
    }
  };

  const updateTrack = (index: number, field: keyof TrackUpload, value: string | number | boolean | File | null) => {
    const newTracks = [...tracks];
    const track = { ...newTracks[index] };
    if (field === 'title') track.title = value as string;
    else if (field === 'trackNumber') track.trackNumber = value as number;
    else if (field === 'file') track.file = value as File | null;
    else if (field === 'isExplicit') track.isExplicit = value as boolean;
    newTracks[index] = track;
    setTracks(newTracks);
  };

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');

    try {
      // Step 1: Upload artwork if provided
      let artworkUrl = '';
      if (artwork) {
        setUploadProgress(10);
        const artForm = new FormData();
        artForm.append('file', artwork);
        artForm.append('type', 'image');
        const artRes = await fetch('/api/upload', { method: 'POST', body: artForm });
        if (artRes.ok) {
          const artData = await artRes.json();
          artworkUrl = artData.url;
        }
      }
      setUploadProgress(30);

      // Step 2: Upload audio files
      const audioUrls: string[] = [];
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.file) {
          const audioForm = new FormData();
          audioForm.append('file', track.file);
          audioForm.append('type', 'audio');
          const audioRes = await fetch('/api/upload', { method: 'POST', body: audioForm });
          if (audioRes.ok) {
            const audioData = await audioRes.json();
            audioUrls.push(audioData.url);
          } else {
            audioUrls.push('');
          }
        } else {
          audioUrls.push('');
        }
        setUploadProgress(30 + Math.round(((i + 1) / tracks.length) * 40));
      }

      // Step 3: Create album/track records in DB
      setUploadProgress(75);
      if (uploadType !== 'single' && albumTitle) {
        // Create album first
        const albumRes = await fetch('/api/albums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: albumTitle,
            artistId,
            labelId: labelId || undefined,
            type: uploadType.toUpperCase(),
            genre,
            releaseDate: releaseDate || undefined,
            artwork: artworkUrl || undefined,
          }),
        });
        const albumData = await albumRes.json();
        setUploadProgress(85);

        // Create tracks for the album
        for (let i = 0; i < tracks.length; i++) {
          await fetch('/api/tracks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: tracks[i].title || albumTitle,
              artistId,
              albumId: albumData.id,
              genre,
              isExplicit: tracks[i].isExplicit,
              trackNumber: tracks[i].trackNumber,
              audioUrl: audioUrls[i] || null,
            }),
          });
        }
      } else {
        // Single track
        await fetch('/api/tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: tracks[0]?.title || albumTitle,
            artistId,
            genre,
            isExplicit: tracks[0]?.isExplicit || false,
            audioUrl: audioUrls[0] || null,
          }),
        });
      }

      setUploadProgress(100);
      setUploadStatus('success');
      setUploadMessage('Upload successful! Track is now live on Intube Music.');

      // Reset form after success
      setTimeout(() => {
        setAlbumTitle('');
        setTracks([{ title: '', trackNumber: 1, file: null, isExplicit: false }]);
        setArtwork(null);
        setArtworkPreview(null);
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      setUploadMessage('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">Upload Music</h1>
      <p className="text-[#8888aa] mb-8">Upload new tracks to make them available on Intube Music</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Release Type */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Release Type</label>
          <div className="flex gap-3">
            {(['single', 'album', 'ep'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUploadType(type)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  uploadType === type
                    ? 'bg-[var(--color-primary)] text-black'
                    : 'bg-[#2a2a4a] text-[#8888aa] hover:text-white'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Album/Release Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {uploadType === 'single' ? 'Track Title' : 'Album/EP Title'}
            </label>
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white placeholder-[#6666aa] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Artist</label>
            <select
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            >
              <option value="">Select Artist...</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              <option value="new">+ Add New Artist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Label / Company</label>
            <select
              value={labelId}
              onChange={(e) => setLabelId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="">Select Label (Optional)...</option>
              {labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              <option value="new">+ Add New Label</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            >
              <option value="">Select Genre...</option>
              <option value="bollywood">Bollywood</option>
              <option value="pop">Pop</option>
              <option value="hip-hop">Hip Hop</option>
              <option value="classical">Classical</option>
              <option value="devotional">Devotional / Bhajan</option>
              <option value="folk">Folk / Rasiya</option>
              <option value="sufi">Sufi</option>
              <option value="rock">Rock</option>
              <option value="electronic">Electronic</option>
              <option value="indie">Indie</option>
              <option value="punjabi">Punjabi</option>
              <option value="haryanvi">Haryanvi</option>
              <option value="rajasthani">Rajasthani</option>
              <option value="bhojpuri">Bhojpuri</option>
              <option value="ghazal">Ghazal</option>
              <option value="lofi">Lo-Fi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Release Date</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>

        {/* Artwork Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Cover Artwork</label>
          <div className="flex items-start gap-4">
            <div className="w-40 h-40 bg-[#2a2a4a] border-2 border-dashed border-[#3a3a5a] rounded-lg flex items-center justify-center overflow-hidden">
              {artworkPreview ? (
                <img src={artworkPreview} alt="Artwork" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-xs text-[#6666aa] mt-2">3000x3000px</p>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleArtworkChange}
                className="hidden"
                id="artwork-upload"
              />
              <label
                htmlFor="artwork-upload"
                className="inline-block px-4 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-white cursor-pointer hover:bg-[#3a3a5a] transition-colors"
              >
                Choose Image
              </label>
              <p className="text-xs text-[#6666aa] mt-2">JPG, PNG. Min 3000x3000px recommended.</p>
            </div>
          </div>
        </div>

        {/* Track Files */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-white">
              {uploadType === 'single' ? 'Audio File' : 'Tracks'}
            </label>
            {uploadType !== 'single' && (
              <button
                type="button"
                onClick={addTrack}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
              >
                + Add Track
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tracks.map((track, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-[#2a2a4a] rounded-lg border border-[#3a3a5a]">
                <span className="text-sm font-mono text-[#6666aa] w-6">{track.trackNumber}</span>
                <input
                  type="text"
                  value={track.title}
                  onChange={(e) => updateTrack(index, 'title', e.target.value)}
                  placeholder="Track title..."
                  className="flex-1 px-3 py-2 bg-[#1a1a2e] border border-[#3a3a5a] rounded text-white text-sm placeholder-[#6666aa] focus:outline-none focus:border-[var(--color-primary)]"
                  required
                />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => updateTrack(index, 'file', e.target.files?.[0] || null)}
                  className="text-xs text-[#8888aa] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#3a3a5a] file:text-white cursor-pointer"
                  required
                />
                <label className="flex items-center gap-1 text-xs text-[#8888aa] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={track.isExplicit}
                    onChange={(e) => updateTrack(index, 'isExplicit', e.target.checked)}
                    className="rounded"
                  />
                  18+
                </label>
                {tracks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#6666aa] mt-2">Supported: WAV, FLAC, MP3, AAC, OGG (WAV/FLAC recommended for best quality)</p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-[#2a2a4a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">Uploading...</span>
              <span className="text-sm text-[var(--color-primary)]">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Message */}
        {uploadStatus === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
            {uploadMessage}
          </div>
        )}
        {uploadStatus === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            {uploadMessage}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-3 bg-[var(--color-primary)] text-black font-semibold rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload & Publish'}
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-[#2a2a4a] text-white font-medium rounded-lg hover:bg-[#3a3a5a] transition-colors"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
