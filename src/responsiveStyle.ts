import { Properties } from 'csstype'
import { mapMediaQuery, sortMediaQueries } from './mediaQueries'
import {
  CSSObject,
  MutableCSSObject,
  MediaQueries,
  ResponsiveStyle,
  ResponsiveStyleMapper,
  StyleWithMediaQuery,
  Options,
} from './types'

/**
 * Removes empty fields in CSS object with undefined values
 */
function cleanupMapper(cssObject: MutableCSSObject) {
  Object.keys(cssObject).forEach(key => cssObject[key] === undefined && delete cssObject[key])
  return cssObject
}

export function createResponsiveStyle<T>(
  style: ResponsiveStyle<T> | undefined,
  /** Map the style to an CSS object */
  mapper: ResponsiveStyleMapper<T>,
  /** A unique key that is added to each media query to prevent overwriting anothers if merged into same object */
  key?: string | null,
  options?: Options
) {
  if (!Array.isArray(style)) return cleanupMapper(mapper(style)) as CSSObject
  const [initalValue, responsiveValues] = style as StyleWithMediaQuery<T>
  const sortedMediaQueries = Object.entries(responsiveValues).sort((a, b) =>
    sortMediaQueries(a, b, options)
  )
  const mediaQueries = {} as MediaQueries

  for (let [query, style] of sortedMediaQueries) {
    if (style) mediaQueries[mapMediaQuery(query, key, options)] = cleanupMapper(mapper(style))
  }

  return { ...mapper(initalValue), ...mediaQueries } as CSSObject
}

/**
 * createResponsiveCSSProperties accepts an object of only known CSS properties
 * with a simple 1-1 mapping to property and value.
 */
export function createResponsiveCSSProperties(
  properties: Partial<Record<keyof Properties, ResponsiveStyle<string | number | undefined>>>,
  options?: Options
): CSSObject {
  return Object.entries(properties).reduce((total, [property, style]) => {
    return {
      ...total,
      ...createResponsiveStyle(style, value => ({ [property]: value }), property, options),
    }
  }, {})
}
