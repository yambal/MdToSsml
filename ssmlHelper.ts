import { customAlphabet } from 'nanoid'
import { dateFormatForRead } from './mdUtilities'
import { mdToSsml, mdToSsmlResult } from './mdToSsml'

const mediaId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCSEFGHIJKLMNOPQRSTUVWXYZ0123456789', 3) // Media のIDにハイフンは使えない

export type PodCastContent = {
  channel?: {
    title: string,
    description: string
    endingMd: string | null
  }
  title: string
  descMdOrHtmlOrText: string
  publishDate: Date
}

export const podCastSsml = (content: PodCastContent): mdToSsmlResult => {
  const headerSsml = podCastOpeningSsml(content)
  const bodySsmlResult = mdToSsml(content.descMdOrHtmlOrText)
  const bodySsml = bodySsmlResult ? bodySsmlResult.ssml : ''
  const footerSsml = podCastEndingSsml(content)
  
  const ssml = `<speak>${headerSsml}${bodySsml}${footerSsml}</speak>`
  return {
    ssml,
    info: {
      links: bodySsmlResult ? bodySsmlResult.info.links : []
    }
  }
}

/**
 * PodCastを想定したオープニングSSMLを生成する
 * @param props 
 */
const podCastOpeningSsml = (props: PodCastContent) => {
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

const podCastEndingSsml = ({ channel }: PodCastContent):string => {
  if (channel && channel.endingMd) {
    const endingSsmlResult = mdToSsml(channel.endingMd)
    const endingSsml = endingSsmlResult ? endingSsmlResult.ssml : ''
    if(endingSsml){
      return addBgm({
        content: endingSsml,
        audio: {
          url: 'https://yambal.github.io/MdToSsml/bgm_02.mp3',
          introSec: 3,
          afterglowSec: 4,
          fadeoutSec: 3,
          soundLevel: -10
        }
      })
    }
  }
  return ''
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