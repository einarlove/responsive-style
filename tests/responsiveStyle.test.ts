import { createResponsiveStyle, ResponsiveStyle } from '../src'

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
      marginTop: value.top ? value.top + 'px' : undefined,
      marginBottom: value.bottom ? value.bottom + 'px' : undefined,
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
