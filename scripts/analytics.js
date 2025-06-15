// Inicialización de Google Analytics
// Este archivo carga el ID desde config.js para mayor seguridad

// Función para cargar Google Analytics de forma asíncrona
function loadGoogleAnalytics() {
  try {
    // Crear el script de Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);
    
    // Inicializar Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', CONFIG.GOOGLE_ANALYTICS_ID);
    
    console.log('Google Analytics inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Google Analytics:', error);
  }
}

// Cargar Google Analytics después de que se cargue el archivo de configuración
document.addEventListener('DOMContentLoaded', function() {
  if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_ANALYTICS_ID) {
    loadGoogleAnalytics();
  } else {
    console.error('No se pudo cargar la configuración de Google Analytics');
  }
}); 