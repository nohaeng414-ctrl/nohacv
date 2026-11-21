import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientProfile from './ClientProfile'; // سنفصل الجزء التفاعلي قليلاً ليعمل بسلاسة
export const dynamic = 'force-dynamic';
// جلب البيانات مباشرة من السيرفر وقاعدة البيانات
async function getData() {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });
    const skills = await prisma.skill.findMany();
    const languages = await prisma.language.findMany();
    const experiences = await prisma.experience.findMany();
    const projects = await prisma.project.findMany();

    return { profile, skills, languages, experiences, projects };
  } catch (error) {
    console.error("خطأ في جلب بيانات الصفحة الرئيسية:", error);
    return { profile: null, skills: [], languages: [], experiences: [], projects: [] };
  }
}

export default async function Page() {
  const data = await getData();

  return <ClientProfile initialData={data} />;
}
