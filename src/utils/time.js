export const transfromTime = function(date) {
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  month = month > 9 ? month : '0' + month
  var day = date.getDate()
  day = day > 9 ? day : '0' + day
  return `${year}/${month}/${day}`
}
