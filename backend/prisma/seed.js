import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(){
  const adminPass = process.env.ADMIN_PASSWORD || 'MoonLord@2025';
  const pass = await bcrypt.hash(adminPass, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moonlord.com' },
    update: {},
    create: { email: 'admin@moonlord.com', name: 'Admin', password: pass, role: 'ADMIN' }
  });
  const u1 = await prisma.user.upsert({ where:{ email:'alex@example.com' }, update:{}, create:{ email:'alex@example.com', name:'Alex', password: await bcrypt.hash('password',10) } });
  const u2 = await prisma.user.upsert({ where:{ email:'ellie@example.com' }, update:{}, create:{ email:'ellie@example.com', name:'Ellie', password: await bcrypt.hash('password',10) } });
  await prisma.listing.upsert({ where:{ id:'seed-l1' }, update:{}, create:{ id:'seed-l1', title:'Rolex Submariner 116610LN', brand:'Rolex', model:'Submariner', price:12000, condition:'Excellent', location:'NYC', sellerId:u1.id } });
  await prisma.listing.upsert({ where:{ id:'seed-l2' }, update:{}, create:{ id:'seed-l2', title:'Omega Speedmaster Professional', brand:'Omega', model:'Speedmaster', price:5200, condition:'Good', location:'London', sellerId:u2.id } });
  console.log('Seed complete. Admin:', admin.email);
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
