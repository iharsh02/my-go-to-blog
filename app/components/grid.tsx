import { Dimension } from './annotations'

export function Hatch({ measure }: { measure?: string }) {
  return (
    <div aria-hidden className="hatch">
      {measure && (
        <Dimension
          vertical
          compact
          label={measure}
          className="absolute inset-y-0 left-full ml-4 hidden lg:flex"
        />
      )}
    </div>
  )
}
