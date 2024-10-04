"use server"

import { revalidatePath } from "next/cache"
import { CooperativeSchema, MemberSchema } from "./formValidationSchemas"
import prisma from "./prisma"

export const submitCcoperativeForm = async (data:CooperativeSchema)=>{
    // console.log(data + "in the server action")
    try{
    await prisma.cooperative.create({
        data: {
...data

        }
    })
    revalidatePath('/list/cooperatives')
    }catch(err){
        console.log(err)
    }
}

export const submitMemberForm = async (data:MemberSchema)=>{
    // console.log(data + "in the server action")
    try{
    await prisma.member.create({
        data: {
...data

        }
    })
    revalidatePath('/list/cooperatives')
    }catch(err){
        console.log(err)
    }
}