import { partitionCSSProperties } from '../src'

test('Partition CSS properties', () => {
  const cssPropertiesKeys = ['width', 'height']
  const properties = {
    onClick: () => void 0,
    height: 5,
    options: {},
  }
  const output = partitionCSSProperties(properties, cssPropertiesKeys)
  expect(output).toStrictEqual([
    {
      height: 5,
    },
    {
      onClick: properties.onClick,
      options: properties.options,
    },
  ])
})
