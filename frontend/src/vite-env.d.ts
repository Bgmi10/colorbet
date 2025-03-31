  interface ImportMetaEnv {
    VITE_APP_RAZORPAY_KEY_ID: string,
    VITE_APP_URL: string,
    VITE_APP_AWS_SECRET_ACCESS_KEY: string,
    VITE_APP_AWS_ACCESS_KEY_ID: string,
    VITE_APP_BUCKET_NAME: string,
    VITE_APP_FIREBASE_API_KEY: string,
    VITE_APP_FIREBASE_AUTH_DOMAIN: string,
    VITE_APP_FIREBASE_PROJECT_ID: string,
    VITE_APP_FIREBASE_STORAGE_BUCKET: string,
    VITE_APP_FIREBASE_MESSAGE_SENDER_ID: string,
    VITE_APP_FIREBASE_APP_ID: string
    VITE_APP_FIREBASE_MEASUREMENT_ID: string,
    VITE_APP_NODE_ENV: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }