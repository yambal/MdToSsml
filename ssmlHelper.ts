import { customAlphabet } from 'nanoid'
import { dateFormatForRead } from './mdUtilities'

const mediaId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCSEFGHIJKLMNOPQRSTUVWXYZ0123456789', 3) // Media のIDにハイフンは使えない

export type PodCastOpeningSsmlProps = {
  channel?: {
    title: string,
    description: string
  }
  title: string
  description: string
  publishDate: Date
}

/**
 * PodCastを想定したオープニングSSMLを生成する
 * @param props 
 */
export const podCastOpeningSsml = (props: PodCastOpeningSsmlProps) => {
  const headerInnerSSML = `<speak>
    ${props.channel?.title ? `<emphasis level="strong">${props.channel.title}</emphasis><break time="1s" />` : null}
    ${props.channel?.description ? `${props.channel.description}<break time="3s" />` : null}
    ${dateFormatForRead(props.publishDate)}<break time="0.5s" />
    <emphasis level="strong">${props.title}</emphasis><break time="1.5s" />
    ${props.description}
  </speak>`

  return addBgm({
    content: headerInnerSSML,
    audio: {
      url: 'https://yambal.github.io/MdToSsml/bgm_01.mp3',
      introSec: 7,
      afterglowSec: 7,
      fadeoutSec: 3,
      soundLevel: -10
    }
  }) + '<break time="3s"/>'
}

/**
 * BGM
 **/
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
  const id = mediaId()
  return `
  <par>
    <media xml:id="bgm_${id}" begin="${introSec}s">
      ${props.content}
    </media>
    <media end="bgm_${id}.end+${afterglowSec}s" fadeOutDur="${fadeoutSec}s" soundLevel="${soundLevel >= 0 ? `+${soundLevel}` : soundLevel}dB">
      <audio src="${props.audio.url}" />
    </media>
  </par>`
}