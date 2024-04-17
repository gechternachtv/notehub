export default (created) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const date = {
    day: created.getDate() < 9 ? `0${created.getDate()}` : created.getDate(),
    month: months[created.getMonth()],
    year: created.getFullYear(),
    hour: created.getHours() < 9 ? `0${created.getHours()}` : created.getHours(),
    minute: created.getMinutes() < 9 ? `0${created.getMinutes()}` : created.getMinutes()
  }

  return `${date.day} ${date.month} ${date.year} | ${date.hour}:${date.minute}`
}