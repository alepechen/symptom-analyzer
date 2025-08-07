from core.config import create_app
from api import diagnosis,auth,doctor, appointments

app = create_app()
app.include_router(diagnosis.router)
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(appointments.router)

