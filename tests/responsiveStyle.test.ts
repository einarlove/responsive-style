import { createResponsiveStyle, createResponsiveCSSProperties, px, ResponsiveStyle, ResponsiveCSSProperties } from '../src'

test('Takes a style and returns two CSS declarations', () => {
  const cssObject = createResponsiveStyle(5, value => ({
    columnCount: value,
    '--column-count': value,
  }))

  expect(cssObject).toStrictEqual({
    columnCount: 5,
    '--column-count': 5,
  })
})

test('Takes a style as array with multiple media queries and returns a CSS object', () => {
  const cssObject = createResponsiveStyle(
    [
      { top: 20, bottom: 40 },
      {
        700: { top: 30 },
        1000: { bottom: 50 },
      },
    ] as ResponsiveStyle<{ top?: number; bottom?: number }>,
    value => ({
      marginTop: px(value?.top),
      marginBottom: px(value?.bottom),
    })
  )

  expect(cssObject).toStrictEqual({
    marginTop: '20px',
    marginBottom: '40px',
    '@media (min-width: 700px)': {
      marginTop: '30px',
    },
    '@media (min-width: 1000px)': {
      marginBottom: '50px',
    },
  })
})

test('Breakpoints should be sorted by their value, not their alpabetical name', () => {
  const breakpoints = { large: 1200, small: 800 }
  const cssObject = createResponsiveStyle(
    [
      { top: 20, bottom: 40 },
      {
        700: { top: 30 },
        1000: { bottom: 50 },
        large: { bottom: 60 },
        small: { bottom: 45 },
      },
    ] as ResponsiveStyle<{ top?: number; bottom?: number }, keyof typeof breakpoints>,
    value => ({
      marginTop: px(value?.top),
      marginBottom: px(value?.bottom),
    }), { breakpoints }
  )

  const expected = {
    marginTop: '20px',
    marginBottom: '40px',
    '@media (min-width: 700px)': {
      marginTop: '30px',
    },
    '@media (min-width: 800px)': {
      marginBottom: '45px',
    },
    '@media (min-width: 1000px)': {
      marginBottom: '50px',
    },
    '@media (min-width: 1200px)': {
      marginBottom: '60px',
    },
  }

  expect(cssObject).toStrictEqual(expected)
  expect(Object.keys(cssObject)).toStrictEqual(Object.keys(expected))
})

test('createResponsiveCSSProperties returns a map of responsive CSS properties', () => {
  const cssObject = {
    overflow: 'hidden',
    color: ['red', { 600: 'blue' }],
  } as ResponsiveCSSProperties<'overflow' | 'color'>

  const responsiveCSSProperties = createResponsiveCSSProperties(cssObject)

  expect(responsiveCSSProperties).toStrictEqual({
    overflow: 'hidden',
    color: 'red',
    '@media (min-width: 600px)/* color */': {
      color: 'blue',
    }
  })
})
