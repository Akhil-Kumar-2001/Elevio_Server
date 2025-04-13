import jwt from 'jsonwebtoken';
import { IAdminToken } from '../Types/IToken';
import dotenv from 'dotenv';
dotenv.config();


export class Token implements IAdminToken {
  
  private readonly JWT_Key: string = process.env.JWT_SECRET as string;
  private readonly refreshSecret: string =
    process.env.REFRESH_TOKEN_SECRET || " ";

  generatingTokens( id:string,role="admin" ): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign(
      { id,role },  
      this.JWT_Key,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id,role},  // Adding role 
      this.refreshSecret,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }
}

