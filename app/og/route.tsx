import { ImageResponse } from 'next/og'
import { site } from 'app/site'

export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || site.name

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full justify-between p-20"
        style={{ backgroundColor: '#faf9f6', color: '#1c1b19' }}
      >
        <div tw="flex items-center text-3xl" style={{ color: '#6f6d67' }}>
          <div
            tw="w-4 h-4 rounded-full mr-5"
            style={{ backgroundColor: '#c2410c' }}
          />
          {site.name}
        </div>
        <div tw="flex text-7xl font-bold tracking-tight leading-tight">
          {title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
