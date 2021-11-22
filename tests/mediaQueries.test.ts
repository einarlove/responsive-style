import { createResponsiveStyle, ResponsiveStyle } from '../src'

test('Media queries are sorted in ascending order with declarations and custom queries first', () => {
  const cssObject = createResponsiveStyle(
    [
      0,
      {
        200: 2,
        100: 1,
        '@media (min-width: 150px) and (max-width: 250px)': 5,
        300: 3,
      },
    ] as ResponsiveStyle<number>,
    columnCount => ({ columnCount })
  )

  expect(Object.keys(cssObject)).toStrictEqual([
    'columnCount',
    '@media (min-width: 150px) and (max-width: 250px)',
    '@media (min-width: 100px)',
    '@media (min-width: 200px)',
    '@media (min-width: 300px)',
  ])
})

test('Use max-width and descending order of media queries when useMaxWidthMediaQueries is set to true', () => {
  const cssObject = createResponsiveStyle(
    [
      0,
      {
        200: 2,
        100: 1,
        '@media (min-width: 150px) and (max-width: 250px)': 5,
        300: 3,
      },
    ] as ResponsiveStyle<number>,
    columnCount => ({ columnCount }),
    undefined,
    { useMaxWidthMediaQueries: true }
  )

  expect(Object.keys(cssObject)).toStrictEqual([
    'columnCount',
    '@media (min-width: 150px) and (max-width: 250px)',
    '@media (max-width: 300px)',
    '@media (max-width: 200px)',
    '@media (max-width: 100px)',
  ])
})
