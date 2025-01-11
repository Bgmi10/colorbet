  interface ImportMetaEnv {
    VITE_APP_RAZORPAY_KEY_ID: string,
    VITE_APP_URL: string,
    VITE_APP_AWS_SECRET_ACCESS_KEY: string,
    VITE_APP_AWS_ACCESS_KEY_ID: string,
    VITE_APP_BUCKET_NAME: string,
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }