import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config(process.env.CLOUDINARY_URL ? {} : { cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

const upload = multer();
const router = express.Router();

router.post('/', upload.single('file'), async (req,res)=>{
  if(!req.file) return res.status(400).json({ error:'No file' });
  try{
    const result = await new Promise((resolve, reject)=>{
      const stream = cloudinary.uploader.upload_stream({ folder:'moonlord' }, (error, result)=> {
        if(result) resolve(result);
        else reject(error);
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    res.json({ ok:true, url: result.secure_url, public_id: result.public_id });
  }catch(e){
    console.error(e);
    res.status(500).json({ error:'Upload failed' });
  }
});

export default router;
