export function stringTrim(value: string, length: number) {
  if (value == undefined) {
    return ''
  }
  else {
    let trimmedString = value?.substring(0, length);
    return trimmedString + '...'
  }

}
