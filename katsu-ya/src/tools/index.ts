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
    return new Intl.NumberFormat('id-ID', {
        style: currency ? 'currency' : 'decimal',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(num)
}

export const socket = io(import.meta.env.VITE_API_URL)

export const image = import.meta.env.VITE_API_URL + '/images/'
export const placeholder = '../../src/image/placeholder.png'
