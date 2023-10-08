from anvil_extras import routing
from . import forms  # noqa unused_import


import anvil
from app.forms.scrollAlert import scrollAlert

anvil.alert(content=scrollAlert())

routing.launch()
