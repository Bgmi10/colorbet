//<reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_RAZORPAY_KEY_ID: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }