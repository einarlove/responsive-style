import { ResponsiveStyle } from './types'

/**
 * Helper function when used with createResponsiveCSSProperties to split out
 * CSS properties from another object.
 * @example
 * const [cssProperties, rest] = partitionCSSProperties(props, CSSProperties)
 * return <div className={css(createResponsiveCSSProperties(cssProperties))} {...rest} />
 */

// type NonNullableObject<T> = {
//   [P in keyof T]-?: Exclude<T[P], null | undefined>
// }
export function partitionCSSProperties<O extends Object, P extends readonly (keyof O)[]>(
  object: O,
  properties: P
): [Pick<O, P[number]>, Omit<O, P[number]>] {
  return Object.keys(object).reduce(
    (partition, key) => {
      const property = key as keyof O
      const [pick, omit] = partition
      if (properties.includes(property)) {
        return [{ ...pick, [property]: object[property] }, omit]
      } else {
        return [pick, { ...omit, [property]: object[property] }]
      }
    },
    [{}, {}] as [Pick<O, P[number]>, Omit<O, P[number]>]
  )
}

/**
 * mapResponsiveStyle is a utility function that can be used when you
 * receive a responsiveStyle, want to remap it before passing it along
 * to another function that required it.
 * @param R The expected return type of the map function
 * @example mapResponsiveStyle(level, value => `heading ${level}`)
 */
export function mapResponsiveStyle<R, T = unknown>(
  style: ResponsiveStyle<T>,
  mapper: (style: T) => R
): ResponsiveStyle<R> {
  if (!Array.isArray(style)) return mapper(style)
  return [
    mapper(style[0]),
    Object.fromEntries(Object.entries(style[1]).map(entry => [entry[0], mapper(entry[1] as T)])),
  ]
}
