import { io } from 'socket.io-client'

export const timestampToDatetime = (timestamp: string) => {
    return dateString(new Date(timestamp), true)
}

export const dateString = (date: Date, showTime: boolean = false) => {
    return showTime
        ? date.toLocaleString('ID', {
              dateStyle: 'medium',
              timeStyle: 'medium'
          })
        : date.toLocaleString('ID', {
              dateStyle: 'medium'
          })
}

export const formatMoney = (num: number, currency: boolean = false) => {
    const curr = currency ? 'Rp' : ''
    return curr + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const socket = io(import.meta.env.VITE_API_URL)
