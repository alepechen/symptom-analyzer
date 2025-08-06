export interface Appointment {
    id: string;
    doctorName: string;
    date: string;
    time: string;
    location: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }

 export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    location: string;
  }
  
  export interface Props {
    doctors: Doctor[];
  }