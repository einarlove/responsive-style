import type { Properties } from 'csstype'
import { px } from '../px'

type SingleBoxSpacing = string | number
type ObjectBoxSpacing = {
  top?: SingleBoxSpacing
  right?: SingleBoxSpacing
  bottom?: SingleBoxSpacing
  left?: SingleBoxSpacing
  x?: SingleBoxSpacing
  y?: SingleBoxSpacing
}
type BoxSpacing = SingleBoxSpacing | ObjectBoxSpacing
export type Margin = BoxSpacing
export type Padding = BoxSpacing

const boxSpacingMapper = (
  type: 'margin' | 'padding',
  value: BoxSpacing | undefined
): Partial<Properties> => {
  if (value === null) return {}
  if (typeof value === 'number') value = px(value)
  if (typeof value === 'undefined' || typeof value === 'string') return { [type]: value }
  return Object.entries(value).reduce((rule, [property, value]) => {
    if (typeof value === 'number') value = value + 'px'
    if (property === 'x')
      return {
        ...rule,
        [`${type}Left`]: value,
        [`${type}Right`]: value,
      }
    if (property === 'y')
      return {
        ...rule,
        [`${type}Top`]: value,
        [`${type}Bottom`]: value,
      }
    return {
      ...rule,
      [type + property.charAt(0).toUpperCase() + property.slice(1)]: value,
    }
  }, {})
}

export const marginMapper = boxSpacingMapper.bind(null, 'margin')
export const paddingMapper = boxSpacingMapper.bind(null, 'padding')
