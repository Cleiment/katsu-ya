import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './AuthStore'
import { useAppStore } from './AppStore'
import { useSPPStore } from './SPPStore'

export const useExportStore = defineStore('Export', () => {
    const authStore = useAuthStore()
    const appStore = useAppStore()
    const SPPStore = useSPPStore()

    const baseURL = import.meta.env.VITE_API_URL

    const { formatDate, formatMoney, fetchLastImportDate } = SPPStore

    const units: IUnit[] = [
        { id: 'tk', name: 'TK', value: 1 },
        { id: 'sd1', name: 'SD I', value: 2 },
        { id: 'sd2', name: 'SD II', value: 3 },
        { id: 'sd-plus', name: 'SD Plus', value: 4 },
        { id: 'smp', name: 'SMP', value: 5 },
        { id: 'smp-plus', name: 'SMP Plus', value: 6 },
        { id: 'sma', name: 'SMA', value: 7 }
    ]
    const selectedUnit = ref<IUnit>(units[0])

    const spp = ref<ISPP>({
        total: 0,
        spp: []
    })

    const dataExport = ref<IExportAttribute>()

    const bulans = [
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni'
    ]

    const selectedBulan = ref(0)

    const fetchSPP = async () => {
        const url = `${baseURL}/spp/${selectedUnit.value.id}`

        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                    Accept: 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Response status: ${response.statusText}`)
            } else {
                const data = await response.json()
                const rs: ISPP = data.response

                if (rs.error) {
                    throw new Error(rs.error)
                } else {
                    spp.value = rs
                }

                return true
            }
        } catch (error: any) {
            appStore.addNotification('error', `${error.message}. Try again later`)
            return false
        }
    }

    const sortExportData = async () => {
        await fetchSPP()
        await fetchLastImportDate()

        dataExport.value = {
            unit: selectedUnit.value.name,
            data: [],
            bulan: selectedBulan.value,
            dataTimestamp: formatDate(SPPStore.lastImportDate),
            exportTimestamp: new Date().toLocaleString('ID', {
                dateStyle: 'full',
                timeStyle: 'long'
            })
        }

        const dataKelas = ref<IExportKelas[]>([{ kelas: spp.value.spp[0].kelas, siswa: [] }])
        const dataSiswaPerKelas = ref<IExportSiswa[]>([])

        let j = 0
        const bulanExport = selectedBulan.value + 1
        spp.value.spp.forEach((item, i) => {
            if (item.status_siswa == 0) return

            const bulanSudahDibayar = Math.floor(
                (item.sudah_dibayar + (item.total_potongan || 0)) / item.biaya_spp_bulanan
            )
            const bulanBelumDibayar =
                bulanSudahDibayar > bulanExport ? 0 : bulanExport - bulanSudahDibayar

            if (bulanBelumDibayar > 0) {
                dataSiswaPerKelas.value.push({
                    va: item.va,
                    nama: item.nama,
                    belumLunasNominal:
                        bulanExport * item.biaya_spp_bulanan -
                        (item.sudah_dibayar + (item.total_potongan || 0)),
                    belumLunasBulan: [...Array(bulanBelumDibayar).keys()].map(
                        (i) => i + bulanSudahDibayar
                    )
                })
            }

            if (spp.value.spp[i + 1] && spp.value.spp[i + 1].kelas != dataKelas.value[j].kelas) {
                dataKelas.value[j].siswa = dataSiswaPerKelas.value

                dataKelas.value.push({ kelas: spp.value.spp[i + 1].kelas, siswa: [] })
                dataSiswaPerKelas.value = []
                j++
            }
        })

        dataKelas.value = dataKelas.value.filter((item) => {
            if (item.siswa.length != 0) return item
        })

        dataExport.value.data = dataKelas.value
    }

    return { bulans, selectedUnit, selectedBulan, units, dataExport, sortExportData }
})
