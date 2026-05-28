import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download } from 'lucide-react'

interface QrCodeGeneratorProps {
  url: string
}

export default function QrCodeGenerator({ url }: QrCodeGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const downloadSVG = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(blob)
    triggerDownload(downloadUrl, 'scissor-qr.svg')
  }

  const downloadPNG = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Set canvas dimensions to match the QR code
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      triggerDownload(pngFile, 'scissor-qr.png')
    }

    img.src =
      'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const triggerDownload = (downloadUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center h-full'>
      <div className='bg-white p-2 border border-gray-100 rounded-lg flex items-center justify-center mb-4 shadow-sm'>
        {/* We render the SVG natively using the installed library */}
        <QRCodeSVG
          value={`https://${url}`}
          size={120}
          level='H' // High error correction, looks better with logos
          includeMargin={false}
          ref={svgRef}
        />
      </div>

      <div className='flex gap-2 w-full mt-auto'>
        <button
          onClick={downloadPNG}
          className='flex-1 py-2 border border-gray-200 rounded-lg font-semibold text-gray-900 text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 active:scale-95'
        >
          <Download className='w-4 h-4' /> PNG
        </button>
        <button
          onClick={downloadSVG}
          className='flex-1 py-2 border border-gray-200 rounded-lg font-semibold text-gray-900 text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 active:scale-95'
        >
          <Download className='w-4 h-4' /> SVG
        </button>
      </div>
    </div>
  )
}
