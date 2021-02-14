import marked, { Renderer, Slugger } from 'marked'
import { isHtml, htmlToMd, isUrl } from './mdUtilities'

type ssmlRenderer = Renderer & {
}

export type Link = {
  href: string | null
  title: string | null
  text: string
}

export type Image = {
  href: string | null
  title: string | null
  text: string
}


export type mdToSsmlResultInfo = {
  thumbHtml: string[]
}

export type mdToSsmlResult = {
  ssml: string
  info: mdToSsmlResultInfo
}

/**
 * MDをSSMLに変換する
 * HTMLの場合も自動的に判定しSSMLに変換する
 **/
export const mdToSsml = (md: string | null): mdToSsmlResult|null => {
  if (md) {
    let ssml: mdToSsmlResult
    const core = Core()
    if(isHtml(md)) {
      ssml = core.render(htmlToMd(md))
    } else {
      ssml = core.render(md);
    }
    return ssml
  }
  return null
}

const Core = () => {
  const thumbHtml: string[] = []

  const onUnReadable = (html: string) => {
    thumbHtml.push(html)
  }

  const onHeader = (text: String, level: number) => {
    thumbHtml.push(`<div style="margin-left:${level - 1}em; font-weight: bold;">${text}</div>`)
  }

  let linkNum: number = 1
  let imageNum: number = 1

  const renderer: ssmlRenderer = {
    options: {},
    // Block - - - - - - - - - - - - - - - - - - - -
    html: (html: string) => {
      return html
    },
    heading : (text: string, level: number, raw: string, slugger: Slugger) => {
      onHeader(text, level)
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
      // URLを長々と読み上げない
      let ssmlText: string = `URLリンク ${linkNum}`
      linkNum += 1
      if (!isUrl(text)) {
        ssmlText = text
      } else if(title && !isUrl(title)) {
        ssmlText = title
      }

      onUnReadable(`<a href="${href}" title="${title}">${ssmlText}</a>`)
      return `<s class="link">${ssmlText}</s>`
    },
    image: (href: string | null, title: string | null, text: string) => {
      let ssmlText: string = `イメージ ${imageNum}`
      imageNum += 1
      if(text) {
        ssmlText = text
      } else if(title){
        ssmlText = `「${title}」のイメージ`
      }

      onUnReadable(`<figure>${ssmlText}:<img src="${href}" title="${title}" /><figcaption>${ssmlText}</figcaption></figure>`)
      return `<p>${ssmlText}</p>`
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

  const render = (md: string): mdToSsmlResult => {
    marked.use({ renderer })
    const ssml = marked(md)
    return {
      ssml,
      info: {
        thumbHtml
      }
    }
  }

  return {
    render
  }
}

/**
 * Renderer
 * See : https://marked.js.org/using_pro#renderer
 * Ssml : https://cloud.google.com/text-to-speech/docs/ssml?hl=ja
 */


"<div class=\"header-2\">売上債権回転率で経営の効率性がわかる</div><div class=\"header-3\">業種別の売上債権回転率</div><a href=\"https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00553010&tstat=000001019842&cycle=7&tclass1=000001142846&tclass2=000001142847&tclass3val=0\" title=\"null\">URLリンク 1</a><div class=\"header-2\">売上債権回転率が低いときの対策方法</div><div class=\"header-3\">1. 支払期限を短くする</div><div class=\"header-3\">2. 入金の早い現金などの決済に限定する</div><div class=\"header-2\">売上債権回転率と売上債権回転期間の違い</div>"