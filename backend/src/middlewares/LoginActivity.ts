import useragent from "useragent";

export default async function LoginActivity (req: any){

    const ua = useragent.parse(req.headers['user-agent']);

    return {
        browser: `${ua.family} ${ua.major}`,       
        os: `${ua.os.family} ${ua.os.major}`,      
        deviceType: ua.device.family || 'Unknown',
        ip: req.ip,                                  
        location: 'Unknown',                         
        isp: 'Unknown',                              
        connectionType: req.connection.type || 'Unknown', 
      };
}