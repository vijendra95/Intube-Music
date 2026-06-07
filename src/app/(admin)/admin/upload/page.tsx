'use client';

import { useState, useEffect } from 'react';
import { upload } from '@vercel/blob/client';

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
  const [mood, setMood] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackUpload[]>([{ title: '', trackNumber: 1, file: null, isExplicit: false }]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [labels, setLabels] = useState<LabelOption[]>([]);
  const [showNewArtist, setShowNewArtist] = useState(false);
  const [newArtistName, setNewArtistName] = useState('');
  const [creatingArtist, setCreatingArtist] = useState(false);
  const [showNewLabel, setShowNewLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [creatingLabel, setCreatingLabel] = useState(false);

  const loadArtists = () => {
    fetch('/api/artists?limit=100').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.artists || []);
      setArtists(list);
    }).catch(() => {});
  };
  const loadLabels = () => {
    fetch('/api/labels?limit=100').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.labels || []);
      setLabels(list);
    }).catch(() => {});
  };

  useEffect(() => { loadArtists(); loadLabels(); }, []);

  const handleCreateArtist = async () => {
    if (!newArtistName.trim()) return;
    setCreatingArtist(true);
    try {
      const res = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newArtistName.trim(), country: 'India' }),
      });
      if (res.ok) {
        const created = await res.json();
        loadArtists();
        setArtistId(created.id);
        setShowNewArtist(false);
        setNewArtistName('');
      } else {
        alert('Failed to create artist');
      }
    } catch { alert('Network error'); }
    finally { setCreatingArtist(false); }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    setCreatingLabel(true);
    try {
      const res = await fetch('/api/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLabelName.trim(), country: 'India' }),
      });
      if (res.ok) {
        const created = await res.json();
        loadLabels();
        setLabelId(created.id);
        setShowNewLabel(false);
        setNewLabelName('');
      } else {
        alert('Failed to create label');
      }
    } catch { alert('Network error'); }
    finally { setCreatingLabel(false); }
  };

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

    // Validate required fields manually
    if (!albumTitle.trim()) {
      setUploadStatus('error');
      setUploadMessage('Please enter a track/album title.');
      return;
    }
    if (!artistId || artistId === 'new') {
      setUploadStatus('error');
      setUploadMessage('Please select a valid artist (or create a new one first).');
      return;
    }
    const hasAudio = tracks.some(t => t.file);
    if (!hasAudio) {
      setUploadStatus('error');
      setUploadMessage('Please select at least one audio file.');
      return;
    }

    // Refresh artist list to ensure selected artist still exists
    try {
      const res = await fetch('/api/artists?limit=100');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.artists || []);
      setArtists(list);
      if (!list.some((a: ArtistOption) => a.id === artistId)) {
        setArtistId('');
        setUploadStatus('error');
        setUploadMessage('Selected artist no longer exists. The artist list has been refreshed — please select a valid artist and try again.');
        setIsUploading(false);
        return;
      }
    } catch { /* continue with upload */ }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setUploadMessage('Starting upload...');

    try {
      // Step 1: Upload artwork if provided (client-side direct to Blob)
      let artworkUrl = '';
      if (artwork) {
        setUploadMessage('Uploading artwork...');
        setUploadProgress(10);
        try {
          const artBlob = await upload(artwork.name, artwork, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            clientPayload: JSON.stringify({ addRandomSuffix: true }),
          });
          artworkUrl = artBlob.url;
        } catch (err) {
          console.error('Artwork upload failed:', err);
        }
      }
      setUploadProgress(30);

      // Step 2: Upload audio files (client-side direct to Blob - no size limit)
      setUploadMessage('Uploading audio...');
      const audioUrls: string[] = [];
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.file) {
          try {
            setUploadMessage(`Uploading audio ${i + 1}/${tracks.length}...`);
            const audioBlob = await upload(track.file.name, track.file, {
              access: 'public',
              handleUploadUrl: '/api/upload',
              clientPayload: JSON.stringify({ addRandomSuffix: true }),
            });
            audioUrls.push(audioBlob.url);
          } catch (err) {
            console.error('Audio upload failed:', err);
            setUploadStatus('error');
            setUploadMessage(`Audio upload failed: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
            setIsUploading(false);
            return;
          }
        } else {
          audioUrls.push('');
        }
        setUploadProgress(30 + Math.round(((i + 1) / tracks.length) * 40));
      }

      // Step 3: Create album/track records in DB
      setUploadProgress(75);
      setUploadMessage('Saving to database...');
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
        if (!albumRes.ok) {
          const errData = await albumRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to create album');
        }
        const albumData = await albumRes.json();
        setUploadProgress(85);

        // Create tracks for the album
        for (let i = 0; i < tracks.length; i++) {
          const trackRes = await fetch('/api/tracks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: tracks[i].title || albumTitle,
              artistId,
              albumId: albumData.id,
              genre,
              mood: mood || null,
              isPublished: true,
              isExplicit: tracks[i].isExplicit,
              trackNumber: tracks[i].trackNumber,
              audioUrl: audioUrls[i] || null,
              coverUrl: artworkUrl || null,
            }),
          });
          if (!trackRes.ok) {
            const errData = await trackRes.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to create track');
          }
        }
      } else {
        // Single track
        const trackRes = await fetch('/api/tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: tracks[0]?.title || albumTitle,
            artistId,
            genre,
            mood: mood || null,
            isPublished: true,
            isExplicit: tracks[0]?.isExplicit || false,
            audioUrl: audioUrls[0] || null,
            coverUrl: artworkUrl || null,
          }),
        });
        if (!trackRes.ok) {
          const errData = await trackRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to save track');
        }
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
        setUploadMessage('');
        setMood('');
        setGenre('');
        setArtistId('');
        setLabelId('');
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadMessage(msg);
      alert('Upload error: ' + msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">Upload Music</h1>
      <p className="text-[#8888aa] mb-8">Upload new tracks to make them available on Intube Music</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Artist</label>
            <select
              value={artistId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setShowNewArtist(true);
                  setArtistId('');
                } else {
                  setArtistId(e.target.value);
                  setShowNewArtist(false);
                }
              }}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              // validated manually in handleSubmit
            >
              <option value="">Select Artist...</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              <option value="new">+ Add New Artist</option>
            </select>
            {showNewArtist && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  placeholder="Artist name..."
                  className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleCreateArtist}
                  disabled={creatingArtist}
                  className="px-4 py-2 bg-[var(--color-primary)] text-black text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                >
                  {creatingArtist ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewArtist(false)}
                  className="px-3 py-2 bg-[#3a3a5a] text-white text-sm rounded-lg hover:bg-[#4a4a6a]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Label / Company</label>
            <select
              value={labelId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setShowNewLabel(true);
                  setLabelId('');
                } else {
                  setLabelId(e.target.value);
                  setShowNewLabel(false);
                }
              }}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="">Select Label (Optional)...</option>
              {labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              <option value="new">+ Add New Label</option>
            </select>
            {showNewLabel && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Label name..."
                  className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleCreateLabel}
                  disabled={creatingLabel}
                  className="px-4 py-2 bg-[var(--color-primary)] text-black text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                >
                  {creatingLabel ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewLabel(false)}
                  className="px-3 py-2 bg-[#3a3a5a] text-white text-sm rounded-lg hover:bg-[#4a4a6a]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
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
            <label className="block text-sm font-medium text-white mb-2">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="">Select Mood...</option>
              <option value="happy">Happy</option>
              <option value="romantic">Romantic</option>
              <option value="sad">Sad</option>
              <option value="party">Party</option>
              <option value="chill">Chill</option>
              <option value="focus">Focus</option>
              <option value="workout">Workout</option>
              <option value="sleep">Sleep</option>
              <option value="devotional">Devotional</option>
              <option value="motivational">Motivational</option>
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
                  placeholder="Track title (optional for single)"
                  className="flex-1 px-3 py-2 bg-[#1a1a2e] border border-[#3a3a5a] rounded text-white text-sm placeholder-[#6666aa] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => updateTrack(index, 'file', e.target.files?.[0] || null)}
                  className="text-xs text-[#8888aa] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#3a3a5a] file:text-white cursor-pointer"
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
        {(isUploading || uploadStatus === 'uploading') && (
          <div className="bg-[#2a2a4a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">{uploadMessage || 'Uploading...'}</span>
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
