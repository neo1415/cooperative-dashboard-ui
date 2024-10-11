// lib/actions.ts (Server-side)
import { revalidatePath } from "next/cache";
import {  CooperativeSchema, MemberSchema } from "./formValidationSchemas";
import prisma from "./prisma";

export const submitCcoperativeForm = async (data: CooperativeSchema) => {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  const CooperativeKYCEndpoint = `${serverURL}/cooperative-kyc`;
  try {
    const response = await fetch(CooperativeKYCEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error submitting cooperative form');
    }

    const result = await response.json();
    console.log('Successfully submitted:', result);
  } catch (err) {
    console.error('Error submitting form:', err);
  }
};



export const submitMemberForm = async (data: MemberSchema) => {
  try {
    await prisma.member.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/list/members');
  } catch (err) {
    console.error(err);
  }
};
