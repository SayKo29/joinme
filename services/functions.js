function padTo2Digits (num) {
  return num.toString().padStart(2, '0')
}

export function formatToDate (date) {
  return (
    padTo2Digits(date.getDate()) +
    '/' +
    padTo2Digits(date.getMonth() + 1) +
    '/' +
    date.getFullYear()
  )
}
export function formatToTime (date) {
  return (
    padTo2Digits(date.getHours()) +
    ':' +
    padTo2Digits(date.getMinutes()) +
    ':' +
    padTo2Digits(date.getSeconds())
  )
}
export function formatToTimeWithoutSeconds (date) {
  return (
    padTo2Digits(date.getHours()) +
    ':' +
    padTo2Digits(date.getMinutes())
  )
}
