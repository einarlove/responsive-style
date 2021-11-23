import type { Properties } from 'csstype'

export type ResponsiveOptions = {
  /** A unique key that is added to each media query to prevent overwriting anothers if merged into same object. */
  key?: string
  /** By default media queries are added as (min-width: {breakpint}px). Set useMaxWidthMediaQueries to true for max-width instead. */
  useMaxWidthMediaQueries?: boolean
  /** Object with named breakpoints to be mapped. */
  breakpoints?: Record<string, ResponsiveBreakpoint>
}

/**
 * A breakpoint can either be a number that gets converted to a media query
 * based on the option to useMaxWidthMediaQueries. Defaults to min-width.
 * Or it can be a string that gets used as a media query.
 */
export type ResponsiveBreakpoint = string | number

/**
 * CSSObject can contain all the known CSS properties with known values,
 * and extended to allow unknown keys to accept both css variables and
 * media queries that can contain known css properties and css variables.
 */
export type CSSObject = KnownCSSProperties & CSSVariables & MediaQueries
export type MediaQueries = { [key: string]: KnownCSSProperties & CSSVariables }
type KnownCSSProperties = { [key in keyof Properties]: Properties[key] }
type CSSVariables = { [key: string]: string | number | undefined }

/**
 * ResponsiveStyle is a type that accepts a value, or value with
 * media queries. Generics are optional, but recommended.
 * @param T The type of the value accepted
 * @param B Union of breakpoints allowed
 * @example ResponsiveStyle<typeof keyof colors, typeof keyof breakpoints>
 * @todo Should no other breakpoint be allowed if B is provided?
 */
export type ResponsiveStyle<T, B extends string | number = string> = T | StyleWithMediaQuery<T, B>
export type StyleWithMediaQuery<T, B extends string | number = string> = [
  T,
  Partial<Record<B | number, T>>
]

/**
 * ResponsiveCSSProps is used in pair with the helper function
 * createResponsiveCSSProps that accepts only known css properties and
 * returns a 1-to-1 mapping from value to css declaration.
 * @param P Union of properties to accept
 * @param B Union of breakpoints allowed
 * @example
 * enum CSSProps {
 *  'width',
 *  'height',
 *  'overflow',
 *  'borderRadius',
 * }
 * type ComponentProps = ResponsiveCSSProps<keyof CSSProps> & { … }
 *
 * @todo Should KnownCSSProperties be used here??
 */
export type ResponsiveCSSProperties<
  P extends keyof Properties,
  B extends string | number = string
> = {
  [key in P]?:
    | Properties<string | number>[key]
    | StyleWithMediaQuery<Properties<string | number>[key], B>
}

export type MutableCSSObject = KnownCSSProperties & CSSVariables
export type ResponsiveStyleMapper<T = unknown> = (value: T | undefined) => MutableCSSObject
