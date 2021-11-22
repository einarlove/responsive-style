export function px(input: string | number | undefined) {
  switch (typeof input) {
    case 'number':
      return input + 'px'
    default:
      return input
  }
}
