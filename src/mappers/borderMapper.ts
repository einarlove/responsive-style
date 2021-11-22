import type { Properties } from 'csstype'

type SingleBorder = string
type ObjectBorder = {
  top?: SingleBorder
  right?: SingleBorder
  bottom?: SingleBorder
  left?: SingleBorder
  x?: SingleBorder
  y?: SingleBorder
}
export type Border = SingleBorder | ObjectBorder

export const borderMapper = (
  value: Border | undefined
): Partial<
  Pick<Properties, 'border' | 'borderTop' | 'borderRight' | 'borderBottom' | 'borderLeft'>
> => {
  if (typeof value === 'undefined' || typeof value === 'string') return { border: value }
  return Object.entries(value).reduce((rule, [property, value]) => {
    if (property === 'x')
      return {
        ...rule,
        borderLeft: value,
        borderRight: value,
      }
    if (property === 'y')
      return {
        ...rule,
        borderTop: value,
        borderBottom: value,
      }
    return {
      ...rule,
      ['border' + property.charAt(0).toUpperCase() + property.slice(1)]: value,
    }
  }, {})
}
