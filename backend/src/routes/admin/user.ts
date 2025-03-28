import express from "express";
import { prisma } from "../../prisma/prisma";
import { handleResponse } from "../../utils/helper";
import { validEmail } from "../../utils/constants";

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

user.post("/suspend", async (req: express.Request, res: express.Response) => {
  const { email, suspensionEndTime } = req.body;

  if (!validEmail(email) || !suspensionEndTime || isNaN(Date.parse(suspensionEndTime))) {
    handleResponse(res, 400, "Invalid request. Provide a valid email and a valid suspension end time.");
    return;
  }

  const suspensionDate = new Date(suspensionEndTime);
  const currentTime = new Date();

  if (suspensionDate <= currentTime) {
    handleResponse(res, 400, "Suspension end time must be in the future.");
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      handleResponse(res, 404, "User not found.");
      return;
    }

    const user = await prisma.user.update({
      where: { email },
      data: {
        isSuspended: true,
        suspensionEndTime: suspensionDate,
        suspensionTime: currentTime,
      },
      select: {
        isSuspended: true,
        suspensionEndTime: true,
        suspensionTime: true,
      },
    });

    handleResponse(res, 200, `User ${email} has been suspended until ${suspensionDate.toLocaleString()}.`, user);
  } catch (e) {
    console.error("Error suspending user:", e);
    handleResponse(res, 500, "Internal server error.");
  }
});


export default user;
