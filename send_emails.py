#!/usr/bin/env python3
"""
Script para enviar automáticamente los datos del Test de Evaluación por email
Autor: ImpactoDigitalSPM
Email destino: hristiankrasimirov7@gmail.com
"""

import smtplib
import json
import os
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
import pytz

app = Flask(__name__)
CORS(app)  # Permite requests desde cualquier dominio

# Configuración del email - ACTUALIZADA
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
# Configuración con nuevas credenciales
EMAIL_USER = os.getenv('EMAIL_USER', 'solucionesworld2016@gmail.com')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', 'jgtq ucny jpxc nyoy')  # App Password actualizado
DESTINATION_EMAIL = os.getenv('DESTINATION_EMAIL', 'solucionesworld2016@gmail.com')  # Email de destino actualizado
EMAIL_SUBJECT = os.getenv('EMAIL_SUBJECT', 'Webinar - BlacksU Gegenra min 300$ semanales con Hotmart')  # Asunto actualizado

# Validar variables de entorno críticas
def validate_environment():
    """Valida que las variables de entorno críticas estén configuradas"""
    missing = []
    warnings = []
    
    if os.getenv('EMAIL_USER') is None:
        warnings.append('EMAIL_USER')
    if os.getenv('EMAIL_PASSWORD') is None:
        warnings.append('EMAIL_PASSWORD')
    
    # En desarrollo, permitimos valores predeterminados
    is_development = os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_ENV') is None
    
    if warnings and not is_development:
        error_msg = f"❌ Variables de entorno faltantes: {', '.join(warnings)}"
        print(error_msg)
        print("🔧 Configurar con: export EMAIL_USER=email@gmail.com EMAIL_PASSWORD=app_password")
        return False, error_msg
    elif warnings:
        warning_msg = f"⚠️ Usando valores predeterminados para: {', '.join(warnings)}"
        print(warning_msg)
        print("⚠️ Esto solo es válido para desarrollo. En producción, configurar variables de entorno.")
    
    print(f"📧 Email configurado: {EMAIL_USER} -> {DESTINATION_EMAIL}")
    return True, "OK"

def format_test_data(data):
    """Formatea los datos del test en un email legible"""
    
    # Zona horaria de Colombia
    colombia_tz = pytz.timezone('America/Bogota')
    current_time = datetime.now(colombia_tz)
    
    # Mapeo de preguntas (para referencia)
    questions_map = {
        1: "¿Cuál es tu principal motivación para generar $300+ semanales?",
        2: "¿Cuánto tiempo puedes dedicar DIARIAMENTE a construir tu negocio?",
        3: "¿Estás dispuesto/a a invertir en tu educación y herramientas necesarias?",
        4: "¿Cómo describirías tu nivel de disciplina y constancia?",
        5: "¿Qué harías si no ves resultados en las primeras 3-4 semanas?",
        6: "¿Qué nivel de compromiso estás dispuesto/a a asumir para alcanzar tus metas?",
        7: "¿Cómo manejas el rechazo, las críticas y los desafíos?"
    }
    
    # Calcular porcentaje si está disponible
    score_text = ""
    if 'score' in data and 'total_questions' in data:
        percentage = round((int(data['score']) / (int(data['total_questions']) * 2)) * 100, 1)
        score_text = f"""
PUNTUACIÓN DEL TEST:
===================
Puntuación Total: {data['score']}/{int(data['total_questions']) * 2} puntos
Porcentaje: {percentage}%
Estado: {'APROBADO' if percentage >= 70 else 'POTENCIAL' if percentage >= 50 else 'NO PREPARADO'}
"""

    # Formatear respuestas si están disponibles
    answers_text = ""
    if 'answers' in data:
        try:
            answers = json.loads(data['answers']) if isinstance(data['answers'], str) else data['answers']
            answers_text = "\nRESPUESTAS DETALLADAS:\n=====================\n"
            for i, answer in enumerate(answers, 1):
                if i in questions_map:
                    answers_text += f"{i}. {questions_map[i]}\n"
                    answers_text += f"   Respuesta: {answer.get('text', 'No disponible')} ({answer.get('score', 0)} puntos)\n\n"
        except:
            answers_text = "\nRESPUESTAS: Datos no disponibles\n"

    email_body = f"""
🎯 NUEVO TEST DE EVALUACIÓN COMPLETADO
=====================================

DATOS DEL USUARIO:
==================
👤 Nombre: {data.get('name', 'No proporcionado')}
📧 Correo: {data.get('user_email', 'No proporcionado')}
📱 Teléfono (WhatsApp): {data.get('phone', 'No proporcionado')}
🌍 País de Residencia: {data.get('country', 'No proporcionado')}
🎯 Objetivo: {data.get('objective', 'No proporcionado')}

{score_text}

{answers_text}

INFORMACIÓN TÉCNICA:
===================
📅 Fecha y Hora: {current_time.strftime('%d/%m/%Y %H:%M:%S')} (Hora Colombia)
🌐 IP de Origen: {data.get('ip_address', 'No disponible')}
💻 User Agent: {data.get('user_agent', 'No disponible')}

--
📨 Email enviado automáticamente por el sistema de ImpactoDigitalSPM
🔗 Sitio web: {data.get('origin_url', 'https://impactodigitalspm.com')}
    """.strip()
    
    return email_body

def send_email(subject, body, to_email):
    """Envía el email con los datos del test"""
    try:
        # Crear mensaje
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Añadir cuerpo del mensaje
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Conectar al servidor SMTP
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Habilitar seguridad
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        
        # Enviar email
        text = msg.as_string()
        server.sendmail(EMAIL_USER, to_email, text)
        server.quit()
        
        return True, "Email enviado exitosamente"
        
    except Exception as e:
        return False, f"Error al enviar email: {str(e)}"

@app.route('/send-test-data', methods=['POST'])
def receive_test_data():
    """Endpoint para recibir datos del test y enviarlos por email"""
    try:
        # Obtener datos del request
        data = request.get_json() if request.is_json else request.form.to_dict()
        
        # Añadir información adicional
        data['ip_address'] = request.remote_addr
        data['user_agent'] = request.headers.get('User-Agent', '')
        data['origin_url'] = request.headers.get('Referer', '')
        
        # Formatear y enviar email
        email_body = format_test_data(data)
        success, message = send_email(EMAIL_SUBJECT, email_body, DESTINATION_EMAIL)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Datos enviados exitosamente'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': message
            }), 500
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error procesando datos: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servicio está funcionando"""
    return jsonify({
        'status': 'healthy',
        'service': 'Email Sender Service',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/', methods=['GET'])
def index():
    """Página de inicio del servicio"""
    return """
    <h1>🎯 Email Sender Service - ImpactoDigitalSPM</h1>
    <p>Servicio activo para envío automático de emails del Test de Evaluación</p>
    <p><strong>Endpoint:</strong> POST /send-test-data</p>
    <p><strong>Destino:</strong> hristiankrasimirov7@gmail.com</p>
    <p><strong>Estado:</strong> ✅ Funcionando</p>
    """

@app.before_first_request
def startup_validation():
    """Validar configuración al iniciar la aplicación"""
    is_valid, message = validate_environment()
    if not is_valid:
        print("🛑 APLICACIÓN NO PUEDE INICIAR SIN CONFIGURACIÓN CORRECTA")

if __name__ == '__main__':
    # Configuración para desarrollo y producción
    print("🚀 Iniciando Email Sender Service - ImpactoDigitalSPM...")
    print(f"📧 Emails se enviarán a: {DESTINATION_EMAIL}")
    print(f"📨 Asunto: {EMAIL_SUBJECT}")
    
    # Validar configuración
    is_valid, message = validate_environment()
    is_development = os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_ENV') is None
    
    if not is_valid and not is_development:
        print("🛑 No se puede iniciar sin configuración correcta")
        exit(1)
    elif not is_valid:
        print("⚠️ Iniciando en modo desarrollo con valores predeterminados")
        print("⚠️ NOTA: El envío de correos puede fallar sin credenciales válidas")
    
    # Obtener puerto de variable de entorno (para Heroku) o usar 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    print(f"🌐 Servidor iniciando en puerto: {port}")
    print("✨ ¡Servicio listo para recibir datos del formulario!")
    
    # Ejecutar aplicación
    app.run(debug=debug_mode, host='0.0.0.0', port=port) 