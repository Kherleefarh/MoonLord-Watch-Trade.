import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../lib/auth.js';

const router = express.Router();

router.post('/register', async (req,res)=>{
  const { email, password, name } = req.body;
  if(!email || !password) return res.status(400).json({ error:'email+password required' });
  const existing = await prisma.user.findUnique({ where:{ email } });
  if(existing) return res.status(400).json({ error:'Email exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });
  const token = signToken({ id: user.id });
  setAuthCookie(res, token);
  res.json({ ok:true, user: { id: user.id, email: user.email, name: user.name } });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error:'email+password required' });
  const user = await prisma.user.findUnique({ where:{ email } });
  if(!user) return res.status(401).json({ error:'Invalid' });
  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(401).json({ error:'Invalid' });
  const token = signToken({ id: user.id });
  setAuthCookie(res, token);
  res.json({ ok:true, user: { id: user.id, email: user.email, name: user.name } });
});

router.post('/logout', (req,res)=>{
  clearAuthCookie(res);
  res.json({ ok:true });
});

export default router;
