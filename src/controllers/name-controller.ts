
import express, { Request, Response } from "express";
import { sendQuestionService } from "../services/name-service";



export const sendQuestion = async (req: Request, res: Response) => {
    const bodyValue = req.body;
  
    await sendQuestionService(bodyValue, res);
    
    
  };
  