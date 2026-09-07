'use client'

import { useState } from 'react'

export interface GalleryPhoto {
  id: string
  title: string
  day: number
  category: string
  url: string
  author?: string
  uploadedAt?: string
}

const initialPhotos: GalleryPhoto[] = [
  {
    id: 'p1',
    title: 'Opening Plenary Auditorium',
    day: 1,
    category: 'Plenary',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    author: 'Event Coordination Team',
  },
  {
    id: 'p2',
    title: 'Keynote Microphone & Delegates',
    day: 1,
    category: 'Plenary',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    author: 'Event Media',
  },
  {
    id: 'p3',
    title: 'Co-Design Session Discussion',
    day: 1,
    category: 'Breakout',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    author: 'Partner Contributor',
  },
  {
    id: 'p4',
    title: 'Executive Boardroom Meeting',
    day: 2,
    category: 'Workshop',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    author: 'OAK Communications',
  },
  {
    id: 'p5',
    title: 'Breakout Presentation',
    day: 2,
    category: 'Breakout',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    author: 'Session Facilitator',
  },
  {
    id: 'p6',
    title: 'Networking in Venue Lobby',
    day: 2,
    category: 'Social',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    author: 'Event Media',
  },
]

interface PhotoGalleryProps {
  embedded?: boolean
  showUpload?: boolean
  showFilters?: boolean
}

export default function PhotoGallery({
  embedded = true,
  showUpload = true,
  showFilters = true,
}: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDay, setNewDay] = useState(1)
  const [newCategory, setNewCategory] = useState('Plenary')
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)

  const filters = ['All', 'Day 1', 'Day 2', 'Day 3']

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Day 1') return p.day === 1
    if (activeFilter === 'Day 2') return p.day === 2
    if (activeFilter === 'Day 3') return p.day === 3
    return true
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewDataUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!previewDataUrl) return

    const newPhoto: GalleryPhoto = {
      id: 'photo-' + Date.now(),
      title: newTitle.trim() || 'Convening Moment',
      day: newDay,
      category: newCategory,
      url: previewDataUrl,
      author: 'Attendee Upload',
      uploadedAt: 'Just now',
    }

    setPhotos([newPhoto, ...photos])
    setIsUploading(false)
    setPreviewDataUrl(null)
    setNewTitle('')
  }

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)
    }
  }

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
    }
  }

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h2 className="text-[17px] font-extrabold text-[#0F172A]">
            Photo Gallery
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#64748B]">
            {filteredPhotos.length} photos
          </span>
          {showUpload && (
            <button
              onClick={() => setIsUploading(true)}
              className="bg-[#162E55] hover:bg-[#1E3A68] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>+</span>
              <span>Upload</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills (Optional toggle) */}
      {showFilters && (
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f
                  ? 'bg-[#162E55] text-white shadow-xs'
                  : 'bg-white text-[#64748B] border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* 2-Column Photo Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="relative overflow-hidden rounded-[18px] bg-slate-100 aspect-[4/3] shadow-sm cursor-pointer group"
          >
            <img
              src={photo.url}
              alt={photo.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
              <span className="text-white text-[10px] font-bold truncate">
                {photo.title}
              </span>
              <span className="text-white/70 text-[8px]">
                Day {photo.day} · {photo.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Lightbox Modal ─── */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fade-in select-none">
          {/* Top Bar */}
          <div className="w-full max-w-lg flex items-center justify-between text-white pt-2">
            <div>
              <h4 className="text-sm font-bold truncate max-w-[240px]">
                {activePhoto.title}
              </h4>
              <p className="text-[10px] text-white/60">
                Day {activePhoto.day} · {activePhoto.category} {activePhoto.author ? `· ${activePhoto.author}` : ''}
              </p>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Center Image with Prev / Next */}
          <div className="relative w-full max-w-lg flex items-center justify-center my-auto">
            {filteredPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-2 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ‹
              </button>
            )}

            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="max-h-[68vh] max-w-full rounded-2xl shadow-2xl object-contain"
            />

            {filteredPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-2 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Bar: Action */}
          <div className="w-full max-w-lg flex items-center justify-between pb-4 pt-2">
            <span className="text-xs text-white/60 font-medium">
              {(lightboxIndex || 0) + 1} of {filteredPhotos.length}
            </span>

            <a
              href={activePhoto.url}
              target="_blank"
              rel="noopener noreferrer"
              download={`${activePhoto.title}.jpg`}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Save Image
            </a>
          </div>
        </div>
      )}

      {/* ─── Upload Modal ─── */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[26px] p-5 w-[370px] max-w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#0F172A]">
                Upload Event Photo
              </h3>
              <button
                onClick={() => {
                  setIsUploading(false)
                  setPreviewDataUrl(null)
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              {/* File Input / Dropzone */}
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Choose Photo
                </label>
                {previewDataUrl ? (
                  <div className="relative rounded-[16px] overflow-hidden aspect-[4/3] bg-slate-100 mb-2 border border-slate-200">
                    <img
                      src={previewDataUrl}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewDataUrl(null)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer hover:bg-black/80"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[18px] cursor-pointer bg-[#EEF2F6] hover:bg-[#E9EEF5] transition-colors p-4 text-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-xs font-semibold text-[#162E55]">
                      Tap to select photo
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Caption / Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Afternoon plenary audience"
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    Day
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#EEF2F6] border-0 rounded-[12px] text-xs text-[#1E293B] focus:outline-none"
                  >
                    <option value={1}>Day 1 (9 Nov)</option>
                    <option value={2}>Day 2 (10 Nov)</option>
                    <option value={3}>Day 3 (11 Nov)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#EEF2F6] border-0 rounded-[12px] text-xs text-[#1E293B] focus:outline-none"
                  >
                    <option value="Plenary">Plenary</option>
                    <option value="Breakout">Breakout</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploading(false)
                    setPreviewDataUrl(null)
                  }}
                  className="flex-1 py-2.5 rounded-[14px] text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!previewDataUrl}
                  className="flex-1 py-2.5 rounded-[14px] text-xs font-bold text-white bg-[#162E55] hover:bg-[#1E3A68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
