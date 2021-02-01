import { nanoid } from 'nanoid'

type AddBgmProps = {
  content: string
  audio: {
    url: string
    introSec?: number
    afterglowSec?: number
    fadeoutSec?: number
    soundLevel?: number
  }
}

export const addBgm = (props: AddBgmProps) => {
  const {audio : { introSec = 0, afterglowSec = 0, fadeoutSec = 0, soundLevel = 0 }} = props
  const id = nanoid(3)
  return `
  <par>
    <media xml:id="${id}" begin="${introSec}s">
      ${props.content}
    </media>
    <media end='${id}.end+${afterglowSec}s' fadeOutDur="${fadeoutSec}s" soundLevel="${soundLevel >= 0 ? `+${soundLevel}` : soundLevel}dB">
      <audio src="${props.audio.url}">
      </audio>
    </media>
  </par>`
}