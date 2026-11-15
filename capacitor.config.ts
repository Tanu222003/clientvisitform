import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.muditacrm.app',
  appName: 'Mudita CRM',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'clientvisitform-five.vercel.app',
      'park-solitaire-crm-production.up.railway.app',
      '*.railway.app'
    ]
  }
};

export default config;
