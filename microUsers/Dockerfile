# Usa Python como base
FROM python:3.10

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY . /app/
#COPY run.py /app

# Instala dependencias
COPY requirements.txt /app
RUN pip install -r requirements.txt

# Expone el puerto en el que correrá el frontend
EXPOSE 5002

# Comando de inicio
CMD ["python", "run.py"]
