/**
 * @param value A value to a CSS property that is to be converted to a pixel value. If the value is a number, it is assumed to be in pixels,
 *  otherwise it is assumed to be a string that should be left untouched, like 5em, 10vw or 12px.
 * @returns If value is a number, converted to a string with px appended. Otherwise, the input is returned untouched.
 */
export function px(value: string | number | undefined) {
  switch (typeof value) {
    case 'number':
      return value + 'px'
    default:
      return value
  }
}
