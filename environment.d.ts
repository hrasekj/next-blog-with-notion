declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SITE_NAME: string;
      SITE_DESCRIPTION: string;
    }
  }
}

export {};
