# 📧 Configuración del Sistema de Emails Automáticos

## 🎯 Descripción
Script Python para enviar automáticamente los datos del **Test de Evaluación** al email configurado.

---

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
pip install flask flask-cors pytz
```

### 2. Configurar Gmail
Para que el script funcione, necesitas:

#### A. Habilitar Autenticación de 2 Factores en Gmail
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Activar la verificación en 2 pasos

#### B. Crear App Password
1. En la misma sección de Seguridad
2. Buscar "Contraseñas de aplicaciones"
3. Crear una nueva contraseña para "Correo"
4. **Guardar esta contraseña** (la necesitarás para el script)

### 3. Configurar Variables de Entorno

#### En Windows:
```cmd
set EMAIL_USER=tu_email@gmail.com
set EMAIL_PASSWORD=tu_app_password_de_16_caracteres
```

#### En Mac/Linux:
```bash
export EMAIL_USER="tu_email@gmail.com"
export EMAIL_PASSWORD="tu_app_password_de_16_caracteres"
```

#### Archivo .env (Recomendado):
Crea un archivo `.env` en la misma carpeta:
```
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_16_caracteres
```

---

## 💻 Ejecución del Script

### Desarrollo Local:
```bash
python send_emails.py
```

El servicio estará disponible en: `http://localhost:5000`

### Endpoints Disponibles:
- **POST** `/send-test-data` - Recibe datos del formulario
- **GET** `/health` - Verificar estado del servicio  
- **GET** `/` - Página de información

---

## 🌐 Integración con el Sitio Web

### Modificar el JavaScript del formulario:
```javascript
// Reemplazar la función sendTestDataEmail en index.html
function sendTestDataEmail(userData, testAnswers, totalScore) {
    const emailData = {
        name: userData.nombre,
        user_email: userData.correo,
        phone: userData.whatsapp,
        country: userData.pais,
        objective: userData.consulta,
        score: totalScore.toString(),
        total_questions: testQuestions.length.toString(),
        answers: JSON.stringify(testAnswers.map((answer, index) => ({
            question_number: index + 1,
            question: testQuestions[index].question,
            selected_value: answer.value,
            selected_text: testQuestions[index].options.find(opt => opt.value === answer.value)?.text || 'No encontrada',
            score: answer.score
        })))
    };

    // Enviar al servidor Python
    fetch('http://localhost:5000/send-test-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email enviado:', data);
    })
    .catch(error => {
        console.error('Error enviando email:', error);
        // Fallback al método mailto actual
        createBackupEmailForm(userData, testAnswers, totalScore);
    });
}
```

---

## 🚀 Despliegue en Producción

### Opción 1: Heroku (Gratuito)
1. Crear cuenta en [Heroku](https://heroku.com)
2. Instalar Heroku CLI
3. Comandos:
```bash
heroku create impactodigital-emails
heroku config:set EMAIL_USER=tu_email@gmail.com
heroku config:set EMAIL_PASSWORD="tu_app_password"
git add .
git commit -m "Deploy ImpactoDigitalSPM email service"
git push heroku main
```

### Opción 2: DigitalOcean/AWS
- Subir el script a un servidor
- Configurar nginx como proxy reverso
- Usar PM2 o supervisor para mantener el proceso activo
- Configurar certificado SSL

### Opción 3: Railway/Render (Recomendado)
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Deploy automático

---

## 📋 Estructura del Email que se Envía

```
Para: [EMAIL_CONFIGURADO]
Asunto: [ASUNTO_CONFIGURADO]

🎯 NUEVO TEST DE EVALUACIÓN COMPLETADO
=====================================

DATOS DEL USUARIO:
==================
👤 Nombre: Juan Pérez
📧 Correo: juan@example.com
📱 Teléfono (WhatsApp): +57 300 123 4567
🌍 País de Residencia: Colombia
🎯 Objetivo: Generar ingresos online

PUNTUACIÓN DEL TEST:
===================
Puntuación Total: 12/14 puntos
Porcentaje: 85.7%
Estado: APROBADO

RESPUESTAS DETALLADAS:
=====================
1. ¿Cuál es tu principal motivación para generar $300+ semanales?
   Respuesta: Necesito ingresos urgentemente... (2 puntos)

[... más respuestas ...]

INFORMACIÓN TÉCNICA:
===================
📅 Fecha y Hora: 08/01/2025 15:30:25 (Hora Colombia)
🌐 IP de Origen: 192.168.1.1
💻 User Agent: Mozilla/5.0...

--
📨 Email enviado automáticamente por el sistema de ImpactoDigitalSPM
🔗 Sitio web: https://impactodigitalspm.com
```

---

## ⚠️ Notas Importantes

1. **Gmail Limits**: Gmail permite ~500 emails por día con cuentas gratuitas
2. **Seguridad**: Nunca subas credenciales al repositorio público
3. **CORS**: Configurado para aceptar requests desde cualquier dominio
4. **Backup**: El sistema actual con mailto sigue funcionando como respaldo
5. **Logs**: El script registra todos los envíos y errores

---

## 🔧 Troubleshooting

### Error: "Authentication failed"
- Verificar que el App Password sea correcto
- Confirmar que la autenticación en 2 pasos esté activa

### Error: "Connection refused"
- Verificar conexión a internet
- Comprobar que Gmail SMTP esté disponible

### Error: "CORS policy"
- Asegurarse de que CORS esté configurado correctamente
- Usar HTTPS en producción

---

## 📞 Soporte

Para dudas técnicas, contactar a:
- **Email**: [EMAIL_SOPORTE]
- **Asunto**: "Soporte Script Python - ImpactoDigitalSPM"

---

## 🎯 Estado Actual

✅ **Script Python**: Creado y funcional  
✅ **Asunto automático**: Configurado en el script  
✅ **Email destino**: Configurado en el script  
✅ **Formato del email**: Profesional y detallado  
✅ **Respaldo**: Sistema mailto existente mantiene funcionabilidad  
✅ **Seguridad**: Credenciales protegidas con variables de entorno  

**¡El sistema está listo para usarse!** 🚀 