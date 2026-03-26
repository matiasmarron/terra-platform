import type { Translations } from '../es'

const en: Translations = {
  common: {
    app_name:  'Terra',
    loading:   'Loading...',
    error:     'An error occurred',
    save:      'Save',
    cancel:    'Cancel',
    confirm:   'Confirm',
    back:      'Back',
    next:      'Next',
    edit:      'Edit',
    optional:  'optional',
    yes:       'Yes',
    no:        'No',
    or:        'or',
  },

  nav: {
    home:          'Home',
    resources:     'Resources',
    community:     'Community',
    faq:           'FAQ',
    login:         'Sign in',
    start:         'Get started',
    tracking:      'Tracking',
    reviews:       'Experiences',
    consultations: 'Consultations',
    settings:      'Settings',
    logout:        'Sign out',
  },

  landing: {
    meta_title:       'Terra — Microdosing with intention',
    meta_description: 'Guided microdosing platform. Education, personal tracking and community in one place.',

    hero: {
      eyebrow:    'Microdosing with intention',
      headline_1: 'Your guided journey,',
      headline_2: 'at your own pace',
      body:       'Practical education, personal tracking and a community that understands what you are going through. All in one place.',
      cta_primary:   'Start my journey',
      cta_secondary: 'What is microdosing?',
    },

    stats: {
      users:   { value: '+800', label: 'people accompanied' },
      pillars: { value: '3 pillars', label: 'education, tracking, community' },
      privacy: { value: '100%', label: 'private and secure' },
    },

    pillars: {
      eyebrow:  'The platform',
      headline: 'Three pillars that support each other',
      items: {
        education: {
          title: 'Education',
          description: 'Guides, meditations and practical resources for every stage of the process. From how to start to how to integrate what you experience.',
        },
        tracking: {
          title: 'Tracking',
          description: 'Record how you feel each day: mood, energy, sleep, focus and calm. Discover patterns you could not see any other way.',
        },
        community: {
          title: 'Community',
          description: 'Connect with people who share similar experiences. A space of trust, with privacy, without judgment and without noise.',
        },
      },
    },

    reviews: {
      eyebrow:      'Real experiences',
      headline:     'What those who have lived it say',
      cta:          'See all experiences →',
      weeks_label:  'weeks',
    },

    cta_band: {
      headline: 'Start with a solid foundation',
      body:     'Access guides, resources and a community that accompanies you at every stage of the process.',
      button:   'Create my free account',
    },

    faq: {
      eyebrow:   'Frequently asked questions',
      headline:  'Before you start, you are probably wondering',
      body:      'We gathered the most common questions from people considering microdosing for the first time or who want to do it with more structure.',
      cta:       'See all questions →',
    },
  },

  footer: {
    tagline:  'A space to explore microdosing with intention, support and community.',
    sections: {
      platform: 'Platform',
      support:  'Support',
    },
    links: {
      resources:     'Resources',
      tracking:      'Tracking',
      community:     'Community',
      consultations: 'Consultations',
      faq:           'FAQ',
      contact:       'Contact',
      privacy:       'Privacy',
      terms:         'Terms',
    },
    copyright: 'All rights reserved.',
    made_with: 'Made with care.',
  },

  auth: {
    login: {
      title:      'Welcome back',
      subtitle:   'Sign in to your Terra space',
      email:      'Email address',
      password:   'Password',
      forgot:     'Forgot your password?',
      submit:     'Sign in',
      submitting: 'Signing in…',
      no_account: 'Don\'t have an account?',
      register:   'Create account',
    },
    register: {
      title:             'Create your account',
      subtitle:          'Start your journey at Terra',
      email:             'Email address',
      password:          'Password',
      password_hint:     'At least 6 characters',
      confirm_password:  'Confirm password',
      confirm_hint:      'Repeat your password',
      submit:            'Create account',
      submitting:        'Creating account…',
      has_account:       'Already have an account?',
      login:             'Sign in',
      mismatch:          'Passwords do not match.',
      check_email_title: 'Check your email',
      check_email_body:  'Check your email to confirm your account and get started.',
      back_to_login:     '← Back to sign in',
    },
    recover: {
      title:      'Reset password',
      subtitle:   'Enter your email and we will send you a link to reset your password.',
      email:      'Email address',
      submit:     'Send link',
      submitting: 'Sending…',
      sent_title: 'Email sent',
      sent_body:  'If the email exists in our system, you will receive a link to reset your password shortly.',
      back:       '← Back to sign in',
    },
  },

  tracking: {
    page: {
      eyebrow:            'Daily tracking',
      greeting_morning:   'Good morning',
      greeting_afternoon: 'Good afternoon',
      greeting_evening:   'Good evening',
      placeholder_title:  'The tracking form is on its way',
      placeholder_body:   'This section will be available in the next update.',
    },
    form: {
      title_new:     'How are you today?',
      subtitle_new:  'Take a moment to record how you feel.',
      title_edit:    'Edit today\'s log',
      subtitle_edit: 'Change the values you want to update.',
      submit_new:    'Save today\'s log',
      submit_edit:   'Update log',
      submitting:    'Saving…',
      cancel:        'Cancel',
      all_required:  'Fill in all metrics to continue',
    },
    metrics: {
      mood:          { label: 'Mood',          low: 'Low',       high: 'High'      },
      energy:        { label: 'Energy',         low: 'Drained',   high: 'Full'      },
      sleep_quality: { label: 'Sleep quality',  low: 'Poor',      high: 'Excellent' },
      focus:         { label: 'Focus',          low: 'Scattered', high: 'Sharp'     },
      calm:          { label: 'Calm',           low: 'Anxious',   high: 'Peaceful'  },
    },
    routine: {
      label: 'Did you follow your routine today?',
    },
    resource: {
      label:       'Did you use any resource today?',
      placeholder: 'Meditation, breathwork, guide...',
    },
    notes: {
      label:       'Notes',
      placeholder: 'Anything you want to remember from today?',
    },
    summary: {
      completed:      'Today\'s log completed',
      average:        'Overall average:',
      routine_yes:    'Yes',
      routine_no:     'No',
      routine_label:  'Routine followed',
      resource_label: 'Resource used',
      notes_label:    'Notes',
    },
    history: {
      title:   'Recent days',
      empty:   'Your history will appear here starting tomorrow.',
      columns: {
        day:    'Day',
        mood:   'Mood',
        energy: 'Energy',
        sleep:  'Sleep',
        focus:  'Focus',
        calm:   'Calm',
      },
    },
  },

  dashboard: {
    coming_soon: 'Coming soon',
  },
}

export default en
