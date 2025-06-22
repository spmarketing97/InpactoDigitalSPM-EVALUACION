// 📧 CONFIGURACIÓN DE EMAIL - EJEMPLO SEGURO
// ================================================================
// INSTRUCCIONES PARA CONFIGURAR EMAIL:
// 1. Copiar este archivo como email_config.js
// 2. Reemplazar los datos de ejemplo con los reales
// 3. Configurar Formspree en https://formspree.io
// 4. NUNCA subir email_config.js a GitHub (protegido por .gitignore)
// 5. Solo subir este archivo email_config.example.js
// ================================================================

const EMAIL_CONFIG = {
  // 📧 Email de destino - CAMBIAR POR TU EMAIL REAL
  DESTINATION_EMAIL: 'tu-email@gmail.com',
  EMAIL_SUBJECT: 'Asunto del correo personalizado',
  
  // 🔐 Credenciales Gmail (para sistema de respaldo) - CAMBIAR POR TUS DATOS
  GMAIL_USER: 'tu-email@gmail.com',
  GMAIL_APP_PASSWORD: 'xxxx xxxx xxxx xxxx', // App Password de Gmail
  
  // 🌐 Formspree Configuration - CREAR CUENTA EN FORMSPREE.IO
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/TU-FORM-ID', // Tu endpoint de Formspree
  
  // ⚙️ Configuración de envío
  SEND_CONFIG: {
    method: 'formspree', // Método principal recomendado
    auto_send: true, // Envío automático sin confirmación
    backup_enabled: true, // Habilitar Python API como respaldo
    max_retries: 3 // Intentos máximos de envío
  },
  
  // 📊 Configuración de tracking
  TRACKING: {
    track_opens: true, // Trackear apertura de emails
    track_clicks: false, // No trackear clicks (privacidad)
    add_analytics_data: true // Incluir datos de Google Analytics
  }
}; 