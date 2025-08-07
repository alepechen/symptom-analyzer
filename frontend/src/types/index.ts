export interface Appointment {
  id: string
  doctor: Doctor
  appointment_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface AppointmentCreate {
  appointment_time: string
  status: string
  patient_id?: string
  doctor_id: string
}
export interface Doctor {
  id: string
  name: string
  specialty: string
  location: string
}

export interface Props {
  doctors: Doctor[]
}

export type Severity = 'mild' | 'moderate' | 'severe'
export type Duration = 'Today' | 'Few days' | '1-2 weeks' | 'Longer'

export interface SymptomEntry {
  symptom: string
  severity: Severity
  duration: Duration
}

export interface Analysis {
  diagnosis: string
  confidence: number
}
