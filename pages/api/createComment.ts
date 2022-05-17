import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token:process.env.SANITY_API_TOKEN,
  apiVersion:"2022-05-06",
}

const client=sanityClient(config);
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    const {_id,name,email,comment}=JSON.parse(req.body)
 try{
     await client.create({
         _type:'comment',
         post:{
             _type:"reference",
             _ref:_id
         },
         name,
         email,
         comment
     });
 }catch(err){
     return res.status(500).json({message:'error submit comment'})
 }
 console.log('comment submited')
 return  res.status(200).json({message:"commment submited"})
}