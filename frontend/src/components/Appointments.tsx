'use client'
import { useState, useEffect } from 'react';
import { Appointment, Props } from '@/types'

const Appointments: React.FC<Props> = ({ doctors }) => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [shouldUpdateAppointments,setShouldUpdateAppointments] = useState(true)
    useEffect(() => {
      const fetchAppointments =async () =>{
        const res = await fetch('http://localhost:8000/appointments/3', {
            cache: 'no-store', // disables caching like getServerSideProps
          });
          if (!res.ok) throw new Error("Fecth failed");
          const data: Appointment[] = await res.json();
          setAppointments(data)
          setShouldUpdateAppointments(false)
      }  
      fetchAppointments()
      }, [shouldUpdateAppointments])
    // State for modal visibility
    const [showModal, setShowModal] = useState(false);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([])
    // State for new appointment form
    const [newAppointment, setNewAppointment] = useState({
      doctor: '',
      date: '',
      time: '',
    });
    
    // State for form validation errors
    const [formErrors, setFormErrors] = useState({
      doctor: false,
      date: false,
      time: false,
    });
    async function deleteAppointment(id:string) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
            method: 'DELETE',
          });
      
          if (!res.ok) {
            throw new Error('Failed to delete appointment');
          }
      
          const data = await res.json(); 
          console.log('Deleted:', data);
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    const handleCancelAppointment = (id: string) => {
        deleteAppointment(id) 
        setShouldUpdateAppointments(true)
      /* setAppointments(
        appointments.filter((apt) =>
          apt.id !== id)) */
    };
    const fetchAvailableSlots = async(date:any)=>{
        const res = await fetch(`http://localhost:8000/doctors/${newAppointment.doctor}/available_slots/?date=${date}`, {
            cache: 'no-store', // disables caching like getServerSideProps
          });
          if (!res.ok) throw new Error("Fecth failed");
          const data: any = await res.json();

          setAvailableTimeSlots(data.available_slots)
    }
    // Handler for input changes
    console.log(newAppointment.time)
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      if(name==='date'){
        fetchAvailableSlots(value)
      }
        
    
      setNewAppointment({
        ...newAppointment,
        [name]: value,
      });
      
      // Clear validation error when user types
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors({
          ...formErrors,
          [name]: false,
        });
      }
    };
    
    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate form
      const errors = {
        doctor: !newAppointment.doctor,
        date: !newAppointment.date,
        time: !newAppointment.time,
      };
      const localDateTime = new Date(`${newAppointment.date}T${newAppointment.time}:00`).toISOString()

      const appointmentCreate: any = {
        appointment_time:localDateTime,
        status: 'scheduled',
        patient_id: 3,
        doctor_id: newAppointment.doctor,
        
      };
      if (errors.doctor || errors.date || errors.time) {
        setFormErrors(errors);
        return;
      }  else {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
              /*   Authorization: `Bearer ${token}`, */} ,
              body: JSON.stringify(appointmentCreate)
            });
        
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            setShouldUpdateAppointments(true)
          } catch (error) {
            console.error('Error:', error);
          } 
      } 
      
      // Create new appointment
      const selectedDoctor = doctors.find(doc => doc.id=== Number(newAppointment.doctor));
      console.log(selectedDoctor)
      /* if (!selectedDoctor) return;
      
      const appointment: Appointment = {
        id: String(Date.now()),
        doctorName: selectedDoctor.name,
        date: newAppointment.date,
        time: newAppointment.time,
        location: selectedDoctor.location,
        status: 'scheduled',
      };
      
      // Add to appointments list
      setAppointments([appointment, ...appointments]); */
      
      // Reset form and close modal
      setNewAppointment({
        doctor: '',
        date: '',
        time: '',
      });
      setShowModal(false);
    };
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-64">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              My Appointments
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center"
            >
              Book New Appointment
            </button>
          </div>
        </div>
  
        {/* Appointment Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Book New Appointment
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Doctor
                    </label>
                    <select
                      id="doctor"
                      name="doctor"
                      value={newAppointment.doctor}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        formErrors.doctor ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.name} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.doctor && (
                      <p className="mt-1 text-sm text-red-600">Please select a doctor</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={newAppointment.date}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        formErrors.date ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-600">Please select a date</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={newAppointment.time}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        formErrors.time ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    >
                      <option value="">Select a time slot</option>
                      {availableTimeSlots.length>0 && availableTimeSlots.map((timeSlot) => (
                        <option key={timeSlot} value={timeSlot} data-testid="time-slot">
                          {timeSlot}
                        </option>
                      ))}
                    </select>
                    {formErrors.time && (
                      <p className="mt-1 text-sm text-red-600">Please select a time</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        <div className="mt-8 space-y-6">
          {appointments.map((appointment) => {
          const [date, time] = appointment?.appointment_time?.split("T") || []
          console.log(appointment?.id)
          return (
            <div
                key={appointment.id}
                className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden ${
                appointment.status === 'cancelled'
                  ? 'opacity-75'
                  : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {appointment.doctor?.name}
                      </h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                      <span data-testid="appointment-status" className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Upcoming
                      </span>
                  </div>
                </div>
  
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {time}
                    </span>
                  </div>
                </div>
  
                <div className="mt-6 flex justify-end space-x-4">
                  
                      <button
                        data-testid="cancel-appointment"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/10 mr-2"
                      >
                        Cancel
                      </button>
                      
                </div>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    );
  };
  
  export default Appointments; 