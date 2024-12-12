export const baseurl = 'http://localhost:3005'

export const validEmail = (email : string) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    return isValidEmail;
}

export const secretKey = import.meta.env.VITE_APP_SECRET_KEY as string;