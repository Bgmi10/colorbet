import express from 'express'
import Authmiddleware from '../middlewares/Authmiddleware';


const Demo = express.Router();

Demo.post('/demo' , Authmiddleware , (req,res) => {

    res.json({
        message : 'demo'
    })
})

export default Demo