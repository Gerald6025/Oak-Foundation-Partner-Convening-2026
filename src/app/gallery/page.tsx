import AppShell from '@/components/layout/AppShell'
import PhotoGallery from '@/components/gallery/PhotoGallery'

export const metadata = {
  title: 'Photo Gallery | OAK Partner Convening 2026',
  description: 'Live photo documentation and highlights from the OAK Partner Convening 2026.',
}

export default function GalleryPage() {
  return (
    <AppShell showBottomNav={true}>
      <div className="w-full flex flex-col items-center px-4 pt-4 pb-24">
        <div className="w-[370px] max-w-full">
          <div className="mb-4">
            <h1 className="text-[26px] font-black text-[#0F172A] leading-tight">
              Event Gallery
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-normal">
              OAK Partner Convening 2026 · Live Photo Stream
            </p>
          </div>

          <div className="bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80">
            <PhotoGallery embedded={false} showUpload={true} showFilters={true} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
