export function stringTrim(value: string, length: number) {
  if (value == undefined) {
    return ''
  }
  else {
    let trimmedString = value?.substring(0, length);
    if (length < value.length) {
      return trimmedString + '...'
    } else return trimmedString
  }

}

export function addParenthesisToString(value: string | undefined) {
  if (value == undefined) {
    return '()'
  }
  else {
    const stringBetweenParanties = ' (' + value + ') '
    return stringBetweenParanties
  }

}
