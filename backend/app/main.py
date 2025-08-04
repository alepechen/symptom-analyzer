from core.config import create_app
from api import diagnosis,auth

app = create_app()
app.include_router(diagnosis.router)
app.include_router(auth.router)

