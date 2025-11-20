import express from 'express';
import prisma from '../lib/prisma.js';
import { getUserFromReq } from '../lib/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', async (req,res)=>{
  const listings = await prisma.listing.findMany({ include: { seller: true }, orderBy: { createdAt: 'desc' } });
  res.json(listings);
});

router.post('/', async (req,res)=>{
  const user = await getUserFromReq(req);
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  const { title, brand, model, price, condition, location, description, images } = req.body;
  const listing = await prisma.listing.create({
    data: { id: uuidv4(), title, brand, model, price: Number(price), condition, location, description, images: images || [], sellerId: user.id }
  });
  res.json(listing);
});

router.get('/:id', async (req,res)=>{
  const { id } = req.params;
  const listing = await prisma.listing.findUnique({ where: { id }, include: { seller: true } });
  if(!listing) return res.status(404).json({ error:'Not found' });
  res.json(listing);
});

export default router;
