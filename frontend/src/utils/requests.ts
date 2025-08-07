import { Appointment, AppointmentCreate, SymptomEntry } from '@/types'

export const fetchAppointments = async (
  userId: string
): Promise<Appointment[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/${userId}`
  )
  if (!response.ok) throw new Error('Fecth failed')
  return response.json()
}

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete appointment')
    }
  } catch (error) {
    console.error((error as Error).message)
  }
}

export const createAppointment = async (
  appointmentCreate: AppointmentCreate
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentCreate),
    }
  )

  if (!response.ok) {
    throw new Error('Network responseponse was not ok')
  }
}

export const fetchAvailableSlots = async (
  doctor: string,
  date: string
): Promise<{ available_slots: [] }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor}/available_slots/?date=${date}`
  )
  if (!response.ok) throw new Error('Fecth failed')
  return response.json()
}

export const fetchDiagnosis = async (
  token: string | null,
  selectedSymptomEntries: SymptomEntry[]
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(selectedSymptomEntries),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}
