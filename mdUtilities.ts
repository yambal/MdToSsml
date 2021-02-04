var TurndownService = require('turndown')

/**
 * 
 * @param str HTMLタグを取り除く
 */
const stripTags = (str: string) => {
  return str.replace(/(<([^>]+)>)/gi, "")
}

/**
 * HTMLかどうかを判定する
 * @param str 
 */
export const isHtml = (str: string) => {
  return stripTags(str).length !== str.length
}

/**
 * HTMLをMDに変換する
 **/
export const htmlToMd = (html: string): string => {
  const turndownService = new TurndownService()
  return turndownService.turndown(html)
}

// Date =====================================================
/**
 * 読み上げ可能な日時に変換する(日本語)
*/
export const dateFormatForRead = (date: Date):string => {
  const p = getDateTimeFormatParts(date)
  return `${p.year}年${p.month}月${p.day}日${p.weekday} ${p.dayPeriod}${p.hour}時${p.minute}分`
}

export const dateFormatForReadSort = (date: Date):string => {
  const p = getDateTimeFormatParts(date)
  return `${p.month}月${p.day}日${p.weekday}`
}

/**
 * 日時パーツを返す(日本語)
 **/
const getDateTimeFormatParts = (date :Date): any => {
  const parts = dateFormatterForSsml.formatToParts(date)
  const res: any = {}
  parts.map((part) => {
    res[part.type] = part.value
  })
  return res
}

/**
 * DateTime フォーマッター
 **/
export const dateFormatterForSsml = new Intl.DateTimeFormat( 'ja-jp', {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  timeZone: 'Asia/Tokyo'
})
