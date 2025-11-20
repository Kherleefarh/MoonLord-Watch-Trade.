import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from './prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const COOKIE_NAME = process.env.COOKIE_NAME || 'ml_auth';

export function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function setAuthCookie(res, token){
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    maxAge: 60*60*24*7,
    sameSite: 'lax'
  }));
}

export function clearAuthCookie(res){
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', { httpOnly:true, path:'/', maxAge:0 }));
}

export async function getUserFromReq(req){
  try{
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies[COOKIE_NAME];
    if(!token) return null;
    const data = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    return user;
  }catch(e){
    return null;
  }
}
