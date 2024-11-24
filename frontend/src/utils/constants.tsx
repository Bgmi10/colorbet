export const baseurl = 'http://localhost:3005'

export const validEmail = (email : string) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    return isValidEmail;
}