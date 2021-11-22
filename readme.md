# Responsive Style

Functions that take a value or multiple values grouped by breakpoints, and returns an object with CSS declarations and media queries that can be passed to a CSS-in-JS library of choice.

This is utility functions that are designed to be used to create your reuseable components and are to be set up a few times.

For the coming examples we'll be using the `css` function from the `@emotion/css` package. Examples of how to use it with other libraries are coming soon.

```tsx
createResponsiveStyle('blue', => color => ({ color }))
// returns ({ color: 'blue' })

createResponsiveStyle(['blue', { 700: 'red' }], color => ({ color }))
/* returns ({
  color: 'blue',
  '@media (min-width: 700px)': {
    color: 'red'
  }
})*/
```

You can also map the values to something else

```tsx
createResponsiveStyle(color, value => themeColors[value])
createResponsiveStyle(size, textSize => ({ textSize }))
createResponsiveStyle(variant, value => ({
  '--text-color': variant !== 'dark' ? 'black' : 'white',
  backgroundColor: 'var(--text-color)',
}))
```

## Extractors

Sometimes you want to allow a style like margin or padding to be expressed like:

```tsx
{ margin: 4 }
{ margin: '30px auto' }
{ margin: { top: 4, x: 'auto' } }
{ margin: [{ y: 8 }, { 400: { top: 20 }}] }
```

Create a reuseable mapping function that you use in your base components, or use the one provided with in this package.

```tsx
import {
  marginMapper,
  paddingMapper,
  borderMapper,
  createResponsiveStyle
} from 'responsive-style'
createResponsiveStyle(margin, marginMapper)
createResponsiveStyle(padding, paddingMapper)
createResponsiveStyle(border, borderMapper)
```

## Media queries

Media queries can either be written manually:

```tsx
[
  { color: 'black' },
  {
    '@media (min-width: 700px) and (prefers-color-scheme: dark)': {
      color: 'white',
    },
  },
]
```

or by just passing a number as a breakpoint:

```tsx
[{ color: 'red', { 500: { color: 'blue' }}}]
```

By default those breakpoints assume you implement mobile first, thus the breakpoints are set in `(min-width: [breakpoint]px)`. This can be changed in (options)[#options].

### Predefined media queries

If you pass predefined media queries in (options)[#options] you can set them by breakpoint names instead:

```tsx
const breakpoints = {
  large: 1200,
  medium: 600,
  small: 460,
}
type Breakpoint = typeof breakpoints

function Text({
  color,
}: {
  color: ResponsiveStyle<keyof typeof themeColors, Breakpoints>
}) {
  return (
    <div
      className={css(
        createResponsiveStyle(color, value => themeColors[value], { breakpoints }),
      )}
    />
  )
}

<Text color={['purple-20', { large: 'orange-20' }]} />
```

## Media query collisions

If you merge responsive styles to an object like this example:

```tsx
className={css({
  ...createResponsiveStyle(color, value => themeColors[value]),
  ...createResponsiveStyle(display),
})}
```

If both responsive styles include the same media query, only the last one will be included. Either:

1. Pass a key as the third argument: `createResponsiveStyle(color, value => themeColors[value], 'color')`
2. Create unique classnames or use a function provided by your styling library that resolves those conflicts:
```
  cs(css(createResponsiveStyle(display), createResponsiveStyle(textSize)))
```

## Examples

This is a basic example of how you can create a reuseable component that can take a color as a prop, or multiple grouped by breakpoints.
The rest of the examples will be shown in tsx.

```tsx
import React from 'react'
import css from 'emotion'
import { createResponsiveStyle } from 'responsive-style'

export default function Text({ color, ...rest }) {
  return <div className={css(createResponsiveStyle(color => ({ color })))} {...rest} />
}
```

```tsx
import Text from './Text'

export const Example = () => (
  <Text color={['magenta', { 700: 'criomson', 1200: 'black' }]}>Hello World!</Text>
)
```

```html
<style>
  .gwe3w {
    color: magenta;
  }
  @media (min-width: 700px) {
    .gwe3w {
      color: criomson;
    }
  }
  @media (min-width: 1200px) {
    .gwe3w {
      color: black;
    }
  }
</style>

<div class="gwe3w">Hello World!</div>
```

</details>

<hr />

<details>
<summary><strong>Margin & padding</strong></summary>

```tsx
import Box from './Box'

export const Example = () => (
  <Box
    backgroundColor="magenta-20"
    margin={[
      { top: 20 },
      {
        700: {
          top: 40,
          bottom: 20,
        },
      },
    ]}
  />
)
```

</details>
<details>
<summary><strong>Custom mapping</strong></summary>

```tsx
import Box from './Box'

export const Example = () => (
  <Box
    backgroundColor="magenta-20"
    margin={[
      { top: 20 },
      {
        700: {
          top: 40,
          bottom: 20,
        },
      },
    ]}
  />
)
```

</details>
