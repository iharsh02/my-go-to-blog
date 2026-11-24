import { Style, Avatar } from '@dicebear/core'
import lorelei from '@dicebear/styles/lorelei.json'

const style = new Style(lorelei)

// Generated on the server so dicebear never ships to the browser
export function avatarUri(seed = 'Sophie') {
  return new Avatar(style, { seed, size: 128 }).toDataUri()
}
