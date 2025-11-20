import express from 'express';
import prisma from '../lib/prisma.js';
import { getUserFromReq } from '../lib/auth.js';

const router = express.Router();

router.post('/', async (req,res)=>{
  const user = await getUserFromReq(req);
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  const { toId, body } = req.body;
  const msg = await prisma.message.create({ data: { fromId: user.id, toId, body } });
  res.json(msg);
});

router.get('/conversations/:userId', async (req,res)=>{
  const user = await getUserFromReq(req);
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  const other = req.params.userId;
  const messages = await prisma.message.findMany({
    where: { OR: [{ fromId: user.id, toId: other }, { fromId: other, toId: user.id }] },
    orderBy: { createdAt: 'asc' }
  });
  res.json(messages);
});

export default router;
