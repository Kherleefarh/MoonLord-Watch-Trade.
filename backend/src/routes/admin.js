import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
const router = express.Router();

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const token = jwt.sign({ role:'ADMIN' }, process.env.JWT_SECRET || 'dev', { expiresIn:'1d' });
    return res.json({ token });
  }
  return res.status(401).json({ error:'Unauthorized' });
});

function requireAdmin(req,res,next){
  const auth = req.headers.authorization?.split(' ')[1];
  if(!auth) return res.status(401).json({ error:'No token' });
  try{
    const data = jwt.verify(auth, process.env.JWT_SECRET || 'dev');
    if(data.role !== 'ADMIN') return res.status(403).json({ error:'Forbidden' });
    next();
  }catch(e){
    return res.status(401).json({ error:'Invalid token' });
  }
}

router.get('/stats', requireAdmin, async (req,res)=>{
  const users = await prisma.user.count();
  const listings = await prisma.listing.count();
  const messages = await prisma.message.count();
  res.json({ users, listings, messages });
});

router.get('/users', requireAdmin, async (req,res)=>{
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
