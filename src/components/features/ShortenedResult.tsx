export default function ShortenedResult({
  urlData,
}: {
  urlData: { longUrl: string; shortUrl: string }
}) {
  return (
    <div className='p-4 bg-white border border-gray-200 rounded-xl shadow-sm'>
      Result Component Stub for {urlData.shortUrl}
    </div>
  )
}
