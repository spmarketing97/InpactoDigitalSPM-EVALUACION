// Google Analytics avanzado para ImpactoDigitalSPM
// Sistema de seguimiento completo para Lead Magnet
// ID: G-VTX7S2C0D3 (cargado desde config.js protegido)

// Variables globales
let gtag;
let isAnalyticsLoaded = false;

// Función para cargar Google Analytics de forma asíncrona con configuración avanzada
function loadGoogleAnalytics() {
  try {
    // Crear el script de Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);
    
    // Inicializar Google Analytics con configuración avanzada
    window.dataLayer = window.dataLayer || [];
    gtag = function() { dataLayer.push(arguments); }
    
    gtag('js', new Date());
    gtag('config', CONFIG.GOOGLE_ANALYTICS_ID, {
      // Configuración de privacidad y cookies
      anonymize_ip: CONFIG.ANALYTICS_CONFIG.anonymize_ip,
      cookie_domain: CONFIG.ANALYTICS_CONFIG.cookie_domain,
      cookie_expires: CONFIG.ANALYTICS_CONFIG.cookie_expires,
      
      // Configuración de señales y personalización
      allow_google_signals: CONFIG.ANALYTICS_CONFIG.allow_google_signals,
      allow_ad_personalization_signals: CONFIG.ANALYTICS_CONFIG.allow_ad_personalization_signals,
      
      // Envío automático de page view
      send_page_view: CONFIG.ANALYTICS_CONFIG.send_page_view,
      
      // Configuración de custom parameters
      custom_map: CONFIG.ANALYTICS_CONFIG.custom_map
    });
    
    isAnalyticsLoaded = true;
    console.log('✅ Google Analytics G-VTX7S2C0D3 inicializado correctamente');
    
    // Enviar evento de carga inicial
    trackEvent('page_load', {
      page_title: document.title,
      page_location: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error al inicializar Google Analytics:', error);
  }
}

// Función para rastrear eventos personalizados
function trackEvent(eventName, parameters = {}) {
  if (!isAnalyticsLoaded || typeof gtag !== 'function') {
    console.warn('⚠️ Google Analytics no está cargado aún');
    return;
  }
  
  try {
    gtag('event', eventName, {
      event_category: 'Lead Magnet',
      event_label: CONFIG.PROJECT_NAME,
      ...parameters
    });
    console.log(`📊 Evento trackeado: ${eventName}`, parameters);
  } catch (error) {
    console.error('❌ Error al trackear evento:', error);
  }
}

// Función para rastrear conversions específicas
function trackConversion(conversionType, value = 0, currency = 'USD') {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value,
    currency: currency,
    timestamp: new Date().toISOString()
  });
}

// Función para rastrear test completado
function trackTestCompletion(userData, testScore, percentage) {
  trackEvent('test_completed', {
    test_score: testScore,
    test_percentage: percentage,
    user_country: userData.pais,
    conversion_type: percentage >= 70 ? 'approved' : percentage >= 50 ? 'potential' : 'not_ready',
    value: percentage >= 70 ? 100 : percentage >= 50 ? 50 : 10, // Valor estimado del lead
    currency: 'USD'
  });
}

// Función para rastrear clicks en botones importantes
function trackButtonClick(buttonName, location = '') {
  trackEvent('button_click', {
    button_name: buttonName,
    click_location: location,
    page_url: window.location.href
  });
}

// Función para rastrear tiempo en página
function trackTimeOnPage() {
  let startTime = Date.now();
  
  // Trackear tiempo cada 30 segundos
  setInterval(() => {
    let timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      seconds_spent: timeSpent,
      page_url: window.location.href
    });
  }, 30000);
  
  // Trackear al salir de la página
  window.addEventListener('beforeunload', () => {
    let totalTime = Math.round((Date.now() - startTime) / 1000);
    trackEvent('page_exit', {
      total_seconds: totalTime,
      page_url: window.location.href
    });
  });
}

// Función para rastrear scroll profundo
function trackScrollDepth() {
  let maxScroll = 0;
  let scrollMilestones = [25, 50, 75, 90, 100];
  let trackedMilestones = [];
  
  window.addEventListener('scroll', () => {
    let scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      // Trackear milestones de scroll
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
          trackedMilestones.push(milestone);
          trackEvent('scroll_depth', {
            scroll_percentage: milestone,
            page_url: window.location.href
          });
        }
      });
    }
  });
}

// Auto-inicialización y configuración de eventos
document.addEventListener('DOMContentLoaded', function() {
  // Verificar configuración
  if (typeof CONFIG === 'undefined' || !CONFIG.GOOGLE_ANALYTICS_ID) {
    console.error('❌ CONFIG no encontrado o GOOGLE_ANALYTICS_ID faltante');
    return;
  }
  
  // Cargar Google Analytics
  loadGoogleAnalytics();
  
  // Iniciar seguimiento avanzado
  setTimeout(() => {
    if (isAnalyticsLoaded) {
      trackTimeOnPage();
      trackScrollDepth();
      
      // Trackear clicks en botones principales
      document.addEventListener('click', (e) => {
        if (e.target.matches('.cta-button')) {
          trackButtonClick('start_evaluation', 'main_cta');
        }
        if (e.target.matches('.submit-btn')) {
          trackButtonClick('submit_form', 'evaluation_form');
        }
        if (e.target.matches('[onclick*="whatsapp"]') || e.target.matches('[href*="whatsapp"]')) {
          trackButtonClick('whatsapp_join', 'conversion_page');
        }
      });
    }
  }, 1000);
  
  console.log('🚀 Sistema de Analytics avanzado inicializado para ImpactoDigitalSPM');
});

// Hacer funciones disponibles globalmente para uso en HTML
window.trackEvent = trackEvent;
window.trackConversion = trackConversion;
window.trackTestCompletion = trackTestCompletion;
window.trackButtonClick = trackButtonClick;