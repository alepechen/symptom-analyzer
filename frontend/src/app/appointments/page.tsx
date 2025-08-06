import Appointments from '@/components/Appointments';
import { Doctor } from '@/types'

   
export default async function AppointmentsPage() {
    const res = await fetch('http://localhost:8000/doctors', {
        cache: 'no-store', // disables caching like getServerSideProps
      });
    
      const doctors: Doctor[] = await res.json();
  return <Appointments doctors={doctors} />;
}
