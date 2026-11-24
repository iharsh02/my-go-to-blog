import { Style, Avatar } from '@dicebear/core'
import lorelei from '@dicebear/styles/lorelei.json'

const style = new Style(lorelei)

export function avatarUri(seed = 'Sophie') {
  return new Avatar(style, { seed, size: 128 }).toDataUri()
}
