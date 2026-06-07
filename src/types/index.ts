export interface Track {
  id: string;
  title: string;
  slug: string;
  duration: number;
  trackNumber: number;
  isExplicit: boolean;
  isPublished: boolean;
  releaseDate: string | null;
  audioUrl128: string | null;
  audioUrl320: string | null;
  audioUrlFlac: string | null;
  videoUrl: string | null;
  canvasUrl: string | null;
  genre: string | null;
  mood: string | null;
  isrc: string | null;
  lyrics: string | null;
  playCount: number;
  likeCount: number;
  artist: Artist;
  artistId: string;
  album: Album | null;
  albumId: string | null;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  verified: boolean;
  monthlyListeners: number;
  totalStreams: number;
  country: string | null;
  genres: string[];
  socialLinks: Record<string, string> | null;
  label: Label | null;
  labelId: string | null;
  albums?: Album[];
  tracks?: Track[];
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  artwork: string | null;
  releaseDate: string | null;
  type: 'ALBUM' | 'SINGLE' | 'EP' | 'COMPILATION';
  genre: string | null;
  description: string | null;
  totalTracks: number;
  duration: number;
  isExplicit: boolean;
  isPublished: boolean;
  artist: Artist;
  artistId: string;
  label: Label | null;
  labelId: string | null;
  tracks?: Track[];
}

export interface Label {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  founded: number | null;
}

export interface Playlist {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  artwork: string | null;
  isPublic: boolean;
  isEditorial: boolean;
  collaborative: boolean;
  trackCount: number;
  totalDuration: number;
  mood: string | null;
  genre: string | null;
  userId: string;
  tracks?: PlaylistTrack[];
}

export interface PlaylistTrack {
  id: string;
  position: number;
  addedAt: string;
  track: Track;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  linkType: string | null;
  position: number;
  isActive: boolean;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  imageUrl: string | null;
}

export interface Mood {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  imageUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'USER' | 'ARTIST' | 'ADMIN' | 'SUPER_ADMIN';
  subscription: 'FREE' | 'INDIVIDUAL' | 'STUDENT' | 'DUO' | 'FAMILY' | 'HIFI';
}

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
}
