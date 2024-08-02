export const getProtocol = (platform: string, isApp: boolean) => {
    const protocols: { [key: string]: { app: string; browser: string } } = {
      youtube: { app: 'youtube', browser: 'https' },
      facebook: { app: 'fb', browser: 'https' },
      instagram: { app: 'instagram', browser: 'https' },
      x: { app: 'x', browser: 'https' },
      linkedin: { app: 'linkedin', browser: 'https' },
      whatsapp: { app: 'whatsapp', browser: 'https' },
      telegram: { app: 'tg', browser: 'https' },
      snapchat: { app: 'snapchat', browser: 'https' },
    };
  
    return isApp ? protocols[platform].app : protocols[platform].browser;
  };
  
  export const openLink = (baseUrl: string, platform: string) => {
    const isMobile = navigator.userAgent.includes('Mobile');
    const protocol = getProtocol(platform, isMobile);
    const url = `${protocol}://${baseUrl}`;
    window.open(url, '_blank');
  };