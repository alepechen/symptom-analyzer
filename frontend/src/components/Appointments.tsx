'use client'
import { useState, useEffect } from 'react';
import { Appointment, Props } from '@/types'

const Appointments: React.FC<Props> = ({ doctors }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([
      {
        id: '1',
        doctorName: 'Dr. Sarah Johnson',
        date: '2024-04-20',
        time: '10:00 AM',
        location: 'HealthEase Medical Center',
        status: 'scheduled',
      },
      {
        id: '2',
        doctorName: 'Dr. Michael Chen',
        date: '2024-04-25',
        time: '2:30 PM',
        location: 'Heart Care Clinic',
        status: 'scheduled',
      },
      {
        id: '3',
        doctorName: 'Dr. Emily Rodriguez',
        date: '2024-04-15',
        time: '9:15 AM',
        location: 'Diabetes Care Center',
        status: 'scheduled',
      },
      {
        id: '4',
        doctorName: 'Dr. James Wilson',
        date: '2024-03-10',
        time: '11:30 AM',
        location: 'HealthEase Medical Center',
        status: 'completed',
      },
      {
        id: '5',
        doctorName: 'Dr. Lisa Wong',
        date: '2024-03-05',
        time: '3:45 PM',
        location: 'Skin Health Clinic',
        status: 'completed',
      },
      {
        id: '6',
        doctorName: 'Dr. Robert Smith',
        date: '2024-04-18',
        time: '1:00 PM',
        location: 'Joint & Bone Center',
        status: 'cancelled',
      },
    ]);
  
    useEffect(() => {
      const fetchAppointments =async () =>{
        const res = await fetch('http://localhost:8000/appointments/2', {
            cache: 'no-store', // disables caching like getServerSideProps
          });
          if (!res.ok) throw new Error("Fecth failed");
          const data: Appointment[] = await res.json();
          console.log(data)
      }  
      fetchAppointments()
      }, [])
    // State for modal visibility
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] =useState(0)
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
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
  
    const handleCancelAppointment = (id: string) => {
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        )
      );
    };
    const fetchAvailableSlots = async(date:any)=>{
        const res = await fetch(`http://localhost:8000/doctors/${selectedDoctor}/available_slots/?date=${date}`, {
            cache: 'no-store', // disables caching like getServerSideProps
          });
          if (!res.ok) throw new Error("Fecth failed");
          const data: any = await res.json();
          console.log(data)
          setAvailableTimeSlots(data.available_slots)
    }
    // Handler for input changes
  
    const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => { 
        setSelectedDate(e.target.value)

        fetchAvailableSlots(e.target.value)
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      
        fetchAvailableSlots(selectedDate)
    
      setNewAppointment({
        ...newAppointment,
        doctor: selectedDoctor.toString(),
        date: selectedDate,
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
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate form
      const errors = {
        doctor: !newAppointment.doctor,
        date: !newAppointment.date,
        time: !newAppointment.time,
      };
      
      if (errors.doctor || errors.date || errors.time) {
        setFormErrors(errors);
        return;
      }
      
      // Create new appointment
      const selectedDoctor = doctors.find(doc => doc.name === newAppointment.doctor);
      
      if (!selectedDoctor) return;
      
      const appointment: Appointment = {
        id: String(Date.now()),
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        location: selectedDoctor.location,
        status: 'scheduled',
      };
      console.log(appointment)
      // Add to appointments list
      setAppointments([appointment, ...appointments]);
      
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
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        formErrors.doctor ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
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
                      value={selectedDate}
                      onChange={handleDateChange}
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
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
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
          {appointments.map((appointment) => (
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
                        {appointment.doctorName}
                      </h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    {appointment.status === 'scheduled' && (
                      <span data-testid="appointment-status" className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Upcoming
                      </span>
                    )}
                    {appointment.status === 'completed' && (
                      <span data-testid="appointment-status" className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Completed
                      </span>
                    )}
                    {appointment.status === 'cancelled' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
  
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {appointment.date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {appointment.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {appointment.location}
                    </span>
                  </div>
                </div>
  
                <div className="mt-6 flex justify-end space-x-4">
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        data-testid="cancel-appointment"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/10 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <button className="btn-secondary">
                      Book Follow-up
                    </button>
                  )}
                  <button className="text-primary-600 hover:text-primary-500 font-medium text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Appointments; 