export const validEmail = ( email : string ) => {
   const isvalid =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

   return isvalid;
} 


export const generateTransactionId = () => {
    const now = Date.now();
    const randomsuffix = Math.random().toString(36).substring(2, 10);
    return `txn_${now}_${randomsuffix}`;
} 