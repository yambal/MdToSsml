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
