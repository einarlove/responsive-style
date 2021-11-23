import { Properties } from 'csstype'
import { mapMediaQuery, sortMediaQueries } from './mediaQueries'
import {
  CSSObject,
  MutableCSSObject,
  MediaQueries,
  ResponsiveStyle,
  ResponsiveStyleMapper,
  StyleWithMediaQuery,
  ResponsiveOptions,
} from './types'

/**
 * Removes empty fields in CSS object with undefined values
 */
function cleanupMapper(cssObject: MutableCSSObject) {
  Object.keys(cssObject).forEach(key => cssObject[key] === undefined && delete cssObject[key])
  return cssObject
}

/**
 *  Creates a responsive style that can be used to create a responsive style object
 * @param style A style with or without media queries
 * @param mapper A function that maps the style to a CSS object
 * @param options Options for the responsive style
 * @returns A CSS object with media queries if provided
 */
export function createResponsiveStyle<T>(
  style: ResponsiveStyle<T> | undefined,
  mapper: ResponsiveStyleMapper<T>,
  options?: ResponsiveOptions
) {
  if (!Array.isArray(style)) return cleanupMapper(mapper(style)) as CSSObject
  const [initalValue, responsiveValues] = style as StyleWithMediaQuery<T>
  const sortedMediaQueries = Object.entries(responsiveValues).sort((a, b) =>
    sortMediaQueries(a, b, options)
  )
  const mediaQueries = {} as MediaQueries

  for (let [query, style] of sortedMediaQueries) {
    if (style) mediaQueries[mapMediaQuery(query, options)] = cleanupMapper(mapper(style))
  }

  return { ...mapper(initalValue), ...mediaQueries } as CSSObject
}

/**
 * createResponsiveCSSProperties accepts an object of only known CSS properties
 * with a simple 1-1 mapping to property and value.
 */
export function createResponsiveCSSProperties(
  properties: Partial<Record<keyof Properties, ResponsiveStyle<string | number | undefined>>>,
  options: ResponsiveOptions = {}
): CSSObject {
  return Object.entries(properties).reduce((total, [property, style]) => {
    return {
      ...total,
      ...createResponsiveStyle(style, value => ({ [property]: value }), {...options, key: property}),
    }
  }, {})
}
