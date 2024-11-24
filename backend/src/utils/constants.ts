export const validEmail = ( email : string ) => {
   const isvalid =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

   return isvalid;
} 