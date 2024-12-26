export const smsService = (smsData: any) => {
    const { sms_from, sms_body, data_received } = smsData;

    const utrMatch = sms_body.match(/UTR\s*:\s*(\w+)/);
    const amountMatch = sms_body.match(/Amount\s*:\s*(\d+(\.\d+)?)/);

    const utrNumber = utrMatch ? utrMatch[1] : null;
    const amount = amountMatch ? amountMatch[1] : null;

    if(utrNumber && amount){
        console.log("expected Utr", utrNumber);
        console.log("expected amount", amount);


        return{
            success: true,
            utrNumber,
            amount
        };
    }
    else{
        return{
            success: false,
            message: "Invalid sms format"
        }
    }

}