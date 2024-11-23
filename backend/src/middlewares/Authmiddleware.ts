import jwt from 'jsonwebtoken';

//@ts-ignore
const Authmiddleware = (req , res , next ) => {
    const { token } = req.cookies;

    if(token === undefined) {
        res.status(400).json({message : 'no valid token'});
        return
    }
    
    //@ts-ignore
    const istoken = jwt.verify(token.token , process.env.JWT_SECRET);

    if(istoken){
       next();
    }
}

export default Authmiddleware