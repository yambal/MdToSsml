import marked, { Renderer, Slugger } from 'marked'
import { isHtml, htmlToMd } from './mdUtilities'
import * as functions from 'firebase-functions';

/**
 * MDをSSMLに変換する
 * HTMLの場合も自動的に判定しSSMLに変換する
 **/
export const mdToSsml = (md: string | null): string|null => {
  if (md) {
    let ssml: string = ''
    if(isHtml(md)) {
      ssml = render(htmlToMd(md))
    } else {
      ssml = render(md);
    }
    functions.logger.info('ssml',)
    return ssml
  }
  return null
}

/**
 * MDをSSMLに変換するRenderer
 **/
const render = (md: string) => {
  marked.use({ renderer })
  return marked(md)
}

/**
 * Renderer
 * See : https://marked.js.org/using_pro#renderer
 * Ssml : https://cloud.google.com/text-to-speech/docs/ssml?hl=ja
 */
const renderer: Renderer = {
  options: {},
  // Block - - - - - - - - - - - - - - - - - - - -
  html: (html: string) => {
    return html
  },
  heading : (text: String, leval: Number, raw: String, slugger: Slugger) => {
    /**
     * audio, break, emphasis, lang, lookup, mark, phoneme, prosody, say-as, sub, token, voice, w.
     */
    return `<break time="2s"/><emphasis level="strong">${text}</emphasis><break time="0.5s"/>`
  },
  code: (code: string, language: string | undefined, isEscaped: boolean) => {
    // verbatim: 文字ごとにスペルアウト
    return `<say-as interpret-as="verbatim">${code}</say-as>`
  },
  blockquote: (quote: string) => {
    return `<p>${quote}</p>`
  },
  paragraph : (text: string) => {
    return `<p>${text}</p><break time="0.75s"/>`
  },
  hr: () => {
    return `<break time="3s"/>`
  },
  list: (body: string, ordered: boolean, start: number) => {
    return `<p>${body}</p>`
  },
  listitem: (text: string) => {
    return `<p>${text}</p>`
  },
  table: (header: string, body: string) => {
    return `<p>${header}</p>`
  },
  tablerow: (content: string) => {
    return `<p>${content}</p>`
  },
  tablecell: (content: string, flags: { header: boolean, align: "center" | "left" | "right" | null }) => {
    return `<p>${content}</p>`
  },
  checkbox: (checked: boolean) => {
    return checked ? 'チェック済' : '未チェック'
  },
  // Inline - - - - - - - - - - - - - - - - - - - -
  strong: (text: string) => {
    return `<emphasis level="strong">${text}</emphasis>`
  },
  em: (text: string) => {
    return `<s class="em">${text}</s>`
  },
  br: () => {
    return ``
  },
  del: (text: string) => {
    return `<s class="del">${text}</s>`
  },
  link: (href: string | null, title: string | null, text: string) => {
    return `<s class="link">${text}</s>`
  },
  image: (href: string | null, title: string | null, text: string) => {
    return `<s class="image">${text}</s>`
  },
  text: (text: string) => {
    // 何もしない
    return text
  },
  codespan: (code: string) => {
    // verbatim: 文字ごとにスペルアウト
    return `<say-as interpret-as="verbatim">${code}</say-as>`
  },
}



