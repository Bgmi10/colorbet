import express  from "express";
import Authmiddleware from "../../middlewares/Authmiddleware";
import { prisma } from "../../../prisma/prisma";
import { game_user_bet_record } from "../../utils/zod";

const GameUserBetRecord = express.Router();

GameUserBetRecord.get('/A-vs-B/betrecords', Authmiddleware, async (req: express.Request, res: express.Response) => {
    
     //@ts-ignore
    const { email } = req.user;
    const validRequest = game_user_bet_record.safeParse({
        page : parseInt(req.query.page as string) || 1,
        limit : parseInt(req.query.limit as string)|| 10
    })

    if(!validRequest.success){
        res.status(400).json({ message: "not a valid request" });
        return;
    }
    
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string);
        const skip = (page - 1)* limit;
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { 
                bets: {
                    skip: skip,
                    take: limit,
                    orderBy: {
                        createdAt: "desc"
                    }
                }
             },

        })

        if(user){
            const totalBets = await prisma.bet.count({
                where: { userId: user?.id }
            });

            const totalPages = Math.ceil(totalBets / limit);

            if(user.bets.length === 0){
                res.status(200).json({ message: "No bets found for A-vs-B" });
                return;
            }

             res.status(200).json({ 
                message: "bets",
                bets: user.bets,
                totalBets,
                currentPage: page,
                totalPages: totalPages
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
})

export default GameUserBetRecord