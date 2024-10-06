// lib/actions.ts (Server-side)
import { revalidatePath } from "next/cache";
import { CooperativeSchema, MemberSchema } from "./formValidationSchemas";
import prisma from "./prisma";

export const submitCcoperativeForm = async (data: CooperativeSchema) => {
  try {
    await prisma.cooperative.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/list/cooperatives');
  } catch (err) {
    console.error(err);
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
