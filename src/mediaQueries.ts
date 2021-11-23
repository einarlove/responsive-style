import { Options } from './types'

/**
 * mapMediaQuery make sure that we always have a valid media query rule.
 * When provided with a key in options, it's added to each rule to make sure
 * they are unique when added on a object with other media queries.
 * @param mediaQuery Examples: '3em', '500', 500 and '@media (max-width: 500px)'
 * @param options A unique key that is added to the media query to prevent overwriting
 */
export const mapMediaQuery = (
  mediaQuery: string | number,
  options?: Options
): string => {
  const keyComment = options?.key ? `/* ${options.key} */` : ''

  // If the mediaQuery is a valid rule, return it with the key
  if (typeof mediaQuery === 'string' && mediaQuery.startsWith('@media')) {
    return `${mediaQuery}${keyComment}`
  }

  const ruleProperty = options?.useMaxWidthMediaQueries ? 'max-width' : 'min-width'
  mediaQuery =
    options?.breakpoints && mediaQuery in options.breakpoints
      ? options.breakpoints[mediaQuery]
      : mediaQuery

  // If the value is a number, suffix with the pixel unit. We check if it's a number in a string
  // since all properties of a an object is always a string.
  if (typeof mediaQuery === 'number' || !isNaN(Number(mediaQuery))) {
    mediaQuery += 'px'
  }

  return `@media (${ruleProperty}: ${mediaQuery})${keyComment}`
}

/**
 * @todo Should order differently if useMaxWidthMediaQueries
 * @todo Implemented wrong since b is not used.
 */
export const sortMediaQueries = (a: [string, unknown], b: [string, unknown], options?: Options) => {
  const reverse = options?.useMaxWidthMediaQueries
  const left = options?.breakpoints?.[a[0]] || a[0]
  const right = options?.breakpoints?.[b[0]] || b[0]

  if (!isNaN(Number(left)) && !isNaN(Number(right))) {
    return Number(left) > Number(right) ? (reverse ? -1 : 1) : reverse ? 1 : -1
  }
  return -1 // All string media queries go to the top
}
