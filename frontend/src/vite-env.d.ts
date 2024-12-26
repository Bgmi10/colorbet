//<reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_RAZORPAY_KEY_ID: string,
  VITE_APP_URL: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }