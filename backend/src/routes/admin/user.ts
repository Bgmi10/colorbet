import express from "express";
import { prisma } from "../../../prisma/prisma";
import { handleResponse } from "../../utils/helper";

const user = express.Router();
const adminEmail = process.env.ADMIN_EMAIL;

user.get("/users", async (req: express.Request, res: express.Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: adminEmail,
        },
      },
      select: {
         balance: true,
         memberId: true,
         role: true,
         email: true,
         userName: true,
      }
    });
    
    handleResponse(res, 200, "Available users", users);
  } catch (e) {
    console.log(e);
    handleResponse(res, 500, "Internal server error");
  }
});

export default user;
