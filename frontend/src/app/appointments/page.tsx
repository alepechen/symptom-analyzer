import Appointments from '@/components/Appointments'
import { Doctor } from '@/types'

export default async function AppointmentsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
    cache: 'no-store',
  })

  const doctors: Doctor[] = await res.json()
  return <Appointments doctors={doctors} />
}
