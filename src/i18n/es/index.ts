const es = {
  common: {
    app_name:  'Terra',
    loading:   'Cargando...',
    error:     'Ocurrió un error',
    save:      'Guardar',
    cancel:    'Cancelar',
    confirm:   'Confirmar',
    back:      'Volver',
    next:      'Siguiente',
    edit:      'Editar',
    optional:  'opcional',
    yes:       'Sí',
    no:        'No',
    or:        'o',
  },

  nav: {
    home:       'Inicio',
    resources:  'Recursos',
    community:  'Comunidad',
    faq:        'Preguntas frecuentes',
    login:      'Iniciar sesión',
    start:      'Comenzar',
    tracking:   'Seguimiento',
    reviews:    'Experiencias',
    consultations: 'Consultas',
    settings:   'Configuración',
    logout:     'Cerrar sesión',
  },

  landing: {
    meta_title:       'Terra — Microdosing con intención',
    meta_description: 'Plataforma guiada de microdosing. Educación, seguimiento personal y comunidad en un solo lugar.',

    hero: {
      eyebrow:    'Microdosing con intención',
      headline_1: 'Tu camino guiado,',
      headline_2: 'a tu ritmo',
      body:       'Educación práctica, seguimiento personal y una comunidad que entiende lo que estás viviendo. Todo en un solo lugar.',
      cta_primary:   'Comenzar mi camino',
      cta_secondary: '¿Qué es el microdosing?',
    },

    stats: {
      users:    { value: '+800', label: 'personas acompañadas' },
      pillars:  { value: '3 pilares', label: 'educación, seguimiento, comunidad' },
      privacy:  { value: '100%', label: 'privado y seguro' },
    },

    pillars: {
      eyebrow:  'La plataforma',
      headline: 'Tres pilares que se sostienen entre sí',
      items: {
        education: {
          title: 'Educación',
          description: 'Guías, meditaciones y recursos prácticos para cada etapa del proceso. Desde cómo empezar hasta cómo integrar lo que vivís.',
        },
        tracking: {
          title: 'Seguimiento',
          description: 'Registrá cómo te sentís cada día: estado de ánimo, energía, sueño, foco y calma. Descubrí patrones que no podrías ver de otra manera.',
        },
        community: {
          title: 'Comunidad',
          description: 'Conectate con personas que comparten experiencias similares. Un espacio de confianza, con privacidad, sin juzgar y sin ruido.',
        },
      },
    },

    reviews: {
      eyebrow:   'Experiencias reales',
      headline:  'Lo que dicen quienes ya lo vivieron',
      cta:       'Ver todas las experiencias →',
      weeks_label: 'semanas',
    },

    cta_band: {
      headline: 'Empezá con una base sólida',
      body:     'Accedé a guías, recursos y una comunidad que te acompaña en cada etapa del proceso.',
      button:   'Crear mi cuenta gratuita',
    },

    faq: {
      eyebrow:   'Preguntas frecuentes',
      headline:  'Antes de empezar, probablemente te preguntés',
      body:      'Reunimos las preguntas más comunes de personas que están considerando el microdosing por primera vez o que quieren hacerlo con más estructura.',
      cta:       'Ver todas las preguntas →',
    },
  },

  footer: {
    tagline:  'Un espacio para explorar el microdosing con intención, acompañamiento y comunidad.',
    sections: {
      platform: 'Plataforma',
      support:  'Soporte',
    },
    links: {
      resources:     'Recursos',
      tracking:      'Seguimiento',
      community:     'Comunidad',
      consultations: 'Consultas',
      faq:           'Preguntas frecuentes',
      contact:       'Contacto',
      privacy:       'Privacidad',
      terms:         'Términos',
    },
    copyright: 'Todos los derechos reservados.',
    made_with: 'Hecho con cuidado.',
  },

  auth: {
    login: {
      title:       'Bienvenido de vuelta',
      subtitle:    'Ingresá a tu espacio en Terra',
      email:       'Correo electrónico',
      password:    'Contraseña',
      forgot:      '¿Olvidaste tu contraseña?',
      submit:      'Ingresar',
      submitting:  'Ingresando…',
      no_account:  '¿No tenés cuenta?',
      register:    'Crear cuenta',
    },
    register: {
      title:            'Creá tu cuenta',
      subtitle:         'Empezá tu camino en Terra',
      email:            'Correo electrónico',
      password:         'Contraseña',
      password_hint:    'Mínimo 6 caracteres',
      confirm_password: 'Confirmar contraseña',
      confirm_hint:     'Repetí tu contraseña',
      submit:           'Crear cuenta',
      submitting:       'Creando cuenta…',
      has_account:      '¿Ya tenés cuenta?',
      login:            'Iniciar sesión',
      mismatch:         'Las contraseñas no coinciden.',
      check_email_title: 'Revisá tu correo',
      check_email_body:  'Revisá tu correo para confirmar tu cuenta y empezar.',
      back_to_login:    '← Volver al inicio de sesión',
    },
    recover: {
      title:      'Recuperar contraseña',
      subtitle:   'Ingresá tu correo y te enviamos un enlace para restablecer tu contraseña.',
      email:      'Correo electrónico',
      submit:     'Enviar enlace',
      submitting: 'Enviando…',
      sent_title: 'Correo enviado',
      sent_body:  'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña en breve.',
      back:       '← Volver al inicio de sesión',
    },
  },

  tracking: {
    page: {
      eyebrow:     'Seguimiento diario',
      greeting_morning:   'Buenos días',
      greeting_afternoon: 'Buenas tardes',
      greeting_evening:   'Buenas noches',
      placeholder_title:  'El formulario de seguimiento está en camino',
      placeholder_body:   'Esta sección se habilitará en la próxima actualización.',
    },
    form: {
      title_new:    '¿Cómo estás hoy?',
      subtitle_new: 'Tomá un momento para registrar cómo te sentís.',
      title_edit:   'Editar registro de hoy',
      subtitle_edit: 'Modificá los valores que quieras actualizar.',
      submit_new:   'Guardar registro de hoy',
      submit_edit:  'Actualizar registro',
      submitting:   'Guardando…',
      cancel:       'Cancelar',
      all_required: 'Completá todas las métricas para continuar',
    },
    metrics: {
      mood:          { label: 'Estado de ánimo', low: 'Bajo',        high: 'Alto'        },
      energy:        { label: 'Energía',          low: 'Sin energía', high: 'Plena'       },
      sleep_quality: { label: 'Calidad del sueño', low: 'Malo',      high: 'Excelente'   },
      focus:         { label: 'Foco',             low: 'Disperso',    high: 'Agudo'       },
      calm:          { label: 'Calma',            low: 'Ansioso',     high: 'Tranquilo'   },
    },
    routine: {
      label: '¿Seguiste tu rutina hoy?',
    },
    resource: {
      label:       '¿Usaste algún recurso hoy?',
      placeholder: 'Meditación, respiración, guía...',
    },
    notes: {
      label:       'Notas',
      placeholder: '¿Algo que quieras recordar de hoy?',
    },
    summary: {
      completed:   'Registro de hoy completado',
      average:     'Promedio general:',
      routine_yes: 'Sí',
      routine_no:  'No',
      routine_label:  'Rutina seguida',
      resource_label: 'Recurso usado',
      notes_label:    'Notas',
    },
    history: {
      title:    'Últimos días',
      empty:    'Tu historial aparecerá aquí a partir de mañana.',
      columns: {
        day:    'Día',
        mood:   'Ánimo',
        energy: 'Energía',
        sleep:  'Sueño',
        focus:  'Foco',
        calm:   'Calma',
      },
    },
  },

  dashboard: {
    coming_soon: 'Próximamente',
  },

  resources: {
    page: {
      title:       'Recursos',
      subtitle:    'Guías, meditaciones y herramientas para cada etapa de tu proceso.',
      courses_tab: 'Cursos',
      all_tab:     'Todos los recursos',
    },
    categories: {
      before_starting:    'Antes de empezar',
      during_cycle:       'Durante el ciclo',
      difficult_moments:  'Momentos difíciles',
      integration:        'Integración',
      daily_life:         'Vida cotidiana',
    },
    types: {
      meditation:  'Meditación',
      breathwork:  'Respiración',
      ritual:      'Ritual',
      video:       'Video',
      audio:       'Audio',
      guide:       'Guía',
      checklist:   'Lista',
      course:      'Curso',
    },
    actions: {
      open:     'Abrir',
      listen:   'Escuchar',
      watch:    'Ver',
      download: 'Descargar',
    },
    premium_badge:  'Premium',
    empty:          'No hay recursos disponibles en esta categoría.',
  },

  courses: {
    page: {
      title:    'Cursos',
      subtitle: 'Caminos de aprendizaje estructurados para profundizar tu práctica.',
    },
    detail: {
      modules_title: 'Módulos del curso',
      progress:      'Tu progreso',
      completed:     'completados',
      start:         'Comenzar curso',
      continue:      'Continuar',
      finished:      '¡Curso completado!',
    },
    module: {
      mark_done: 'Marcar como completado',
      done:      'Completado',
    },
    empty: 'No hay cursos disponibles por el momento.',
  },

  reviews: {
    page: {
      title:    'Mis experiencias',
      subtitle: 'Compartí tu proceso y ayudá a otras personas en su camino.',
    },
    form: {
      title:                 'Compartir mi experiencia',
      subtitle:              'Tu historia puede acompañar a alguien más.',
      field_title:           'Título',
      field_title_hint:      'Una frase que resuma tu experiencia',
      field_body:            'Tu experiencia',
      field_body_hint:       'Contá cómo fue tu proceso con el microdosing.',
      field_what_changed:    '¿Qué cambió en vos?',
      field_when_changed:    '¿Cuándo notaste el cambio?',
      field_hardest:         '¿Qué fue lo más difícil?',
      field_helped:          '¿Qué te ayudó más?',
      field_routine:         'Describí tu rutina',
      field_routine_hint:    'Protocolo, dosis, frecuencia, etc.',
      field_rating:          'Calificación general',
      submit:                'Enviar experiencia',
      submitting:            'Enviando…',
      success_title:         'Experiencia enviada',
      success_body:          'Gracias por compartir. Tu historia será revisada antes de publicarse.',
    },
    list: {
      title:       'Mis envíos',
      empty:       'Todavía no compartiste ninguna experiencia.',
      status: {
        pending:  'En revisión',
        approved: 'Publicada',
      },
    },
    rewards: {
      title:      'Mis recompensas',
      empty:      'Completá y publicá una experiencia para ganar recompensas.',
      redeem:     'Canjear',
      redeemed:   'Canjeada',
      types: {
        discount:        'Descuento',
        free_shipping:   'Envío gratis',
        premium_content: 'Contenido premium',
        badge:           'Insignia',
      },
    },
    cta: 'Compartir mi experiencia →',
  },

  faq: {
    page: {
      title:    'Preguntas frecuentes',
      subtitle: 'Respuestas a las dudas más comunes sobre el microdosing.',
    },
    categories: {
      practical:  'Prácticas',
      emotional:  'Emocionales',
      process:    'Sobre el proceso',
      safety:     'Seguridad',
    },
    empty: 'No hay preguntas disponibles por el momento.',
  },
}

export default es
export type Translations = typeof es
