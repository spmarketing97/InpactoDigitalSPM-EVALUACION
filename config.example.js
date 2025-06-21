// 🔧 CONFIGURACIÓN DE EJEMPLO - ImpactoDigitalSPM
// ================================================================
// INSTRUCCIONES PARA CONFIGURAR GOOGLE ANALYTICS:
// 1. Copiar este archivo como config.js
// 2. Reemplazar 'TU-ID-DE-GOOGLE-ANALYTICS' con tu ID real (formato: G-XXXXXXXXXX)
// 3. Configurar las URLs de tu dominio
// 4. NUNCA subir el archivo config.js a GitHub (ya está en .gitignore)
// 5. Solo subir este archivo config.example.js
// ================================================================

const CONFIG = {
  // 📊 Google Analytics ID - REEMPLAZAR CON TU ID REAL
  // Formato: G-XXXXXXXXXX (obtenido de Google Analytics 4)
  GOOGLE_ANALYTICS_ID: 'TU-ID-DE-GOOGLE-ANALYTICS',
  
  // 🏷️ Configuración del proyecto
  PROJECT_NAME: 'ImpactoDigitalSPM - Lead Magnet',
  VERSION: '1.0.0',
  ENVIRONMENT: 'production',
  
  // 📈 Configuración avanzada de Analytics
  ANALYTICS_CONFIG: {
    // Configuración de cookies
    cookie_domain: 'auto',
    cookie_expires: 63072000, // 2 años en segundos
    
    // Configuración de eventos
    send_page_view: true,
    linker: {
      domains: ['tudominio.com'] // CAMBIAR por tu dominio
    },
    
    // Configuración de privacidad (cumple GDPR)
    anonymize_ip: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    
    // Parámetros personalizados para conversiones
    custom_map: {
      'custom_parameter_1': 'lead_source',
      'custom_parameter_2': 'evaluation_score'
    }
  },
  
  // 🌐 URLs y endpoints - CONFIGURAR CON TUS DATOS
  URLS: {
    main_site: 'https://tudominio.com', // Tu sitio web principal
    whatsapp_group: 'https://chat.whatsapp.com/TU-ENLACE-GRUPO', // Tu grupo de WhatsApp
    email_api: 'https://tu-servidor.com/send-test-data' // Tu API de emails
  }
};