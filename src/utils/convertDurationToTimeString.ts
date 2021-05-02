const minuteInSecods = 60
const hourInSeconds = minuteInSecods * minuteInSecods

export function convertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / hourInSeconds)

  const minutes = Math.floor((duration % hourInSeconds) / minuteInSecods)

  const seconds = duration % minuteInSecods

  const timeString = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].join(':')

  return timeString
}
