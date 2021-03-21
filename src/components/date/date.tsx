import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const DaysToYears = ({ days }: any) => <>{Math.floor(dayjs.duration({ days: days }).asYears())}</>

export const dateToYears = (date: string) => dayjs(date).get('year')