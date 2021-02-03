import { customAlphabet } from 'nanoid'
import { dateFormatForRead } from './mdUtilities'
import { mdToSsml } from './mdToSsml'

const mediaId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCSEFGHIJKLMNOPQRSTUVWXYZ0123456789', 3) // Media のIDにハイフンは使えない

export type PodCastOpeningSsmlProps = {
  channel?: {
    title: string,
    description: string
  }
  title: string
  descMd: string
  publishDate: Date
}

export const podCastSsml = (content: PodCastOpeningSsmlProps, footer: string) => {
  const headerSsml = podCastOpeningSsml(content)
  const bodySsml = mdToSsml(content.descMd)
  const footerSsml = `<emphasis level="strong">${footer}</emphasis>`
  return `<speak>${headerSsml}${bodySsml}${footerSsml}</speak>`
}

/**
 * PodCastを想定したオープニングSSMLを生成する
 * @param props 
 */
export const podCastOpeningSsml = (props: PodCastOpeningSsmlProps) => {
  const headerInnerSSML = `
    ${props.channel ? `<emphasis level="strong">${props.channel.title}</emphasis><break time="1s" />` : null}
    ${props.channel ? `${props.channel.description}<break time="3s" />` : null}
    ${dateFormatForRead(props.publishDate)}<break time="0.5s" />
    <emphasis level="strong">${props.title}</emphasis>`

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
type Audio = {
  url: string
  introSec?: number
  afterglowSec?: number
  fadeoutSec?: number
  soundLevel?: number
}
type AddBgmProps = {
  content: string
  audio: Audio
}

export const addBgm = (props: AddBgmProps) => {
  const {audio : { introSec = 0, afterglowSec = 0, fadeoutSec = 0, soundLevel = 0 }} = props
  const id = mediaId()
  return `
  <par>
    <media xml:id="bgm_${id}" begin="${introSec}s">
      <speak>${props.content}</speak>
    </media>
    <media end="bgm_${id}.end+${afterglowSec}s" fadeOutDur="${fadeoutSec}s" soundLevel="${soundLevel >= 0 ? `+${soundLevel}` : soundLevel}dB">
      <audio src="${props.audio.url}" />
    </media>
  </par>`
}