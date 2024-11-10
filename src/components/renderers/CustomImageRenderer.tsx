'use client'


function CustomImageRenderer({ data }: any) {
  const src = data.file.url
  return (
    <div className='relative w-full min-h-[15rem]'>
      <img className='object-contain' src={src} alt="Cloudinary Image" />
      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2'>
        <span className='font-bold'>{data.caption}</span>
      </div>
    </div>
  )
}

export default CustomImageRenderer
