'use server';

import { prisma } from '@/lib/prisma';

// 1. دالة التحقق من كلمة المرور (تقرأ من قاعدة البيانات أولاً)
export async function verifyAdminPassword(inputPassword: string) {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  
  // إذا كانت قاعدة البيانات جديدة، نستخدم الكلمة الافتراضية
  const currentPassword = profile?.password || process.env.ADMIN_PASSWORD || 'niceme';
  
  return inputPassword === currentPassword;
}

// 2. دالة جلب البيانات 
export async function getDashboardData() {
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      password: 'niceme',
      nameAr: 'نهى الزيبق',
      nameEn: 'Noha Al-Zebaq',
      titleAr: 'مهندسة معلوماتية',
      titleEn: 'Informatics Engineer',
      bioAr: 'أعمل بشغف...',
      bioEn: 'I passionately build...',
      phone: '00966530848339',
      email: 'nohaeng414@gmail.com',
      linkedin: '',
      github: ''
    }
  });

  const skills = await prisma.skill.findMany();
  const languages = await prisma.language.findMany();
  const experiences = await prisma.experience.findMany();
  const projects = await prisma.project.findMany();

  return { profile, skills, languages, experiences, projects };
}

// 3. دالة حفظ جميع التعديلات
export async function saveDashboardData(data: any) {
  try {
    // تحديث البروفايل وكلمة المرور
    await prisma.profile.update({
      where: { id: 1 },
      data: {
        password: data.password, // حفظ كلمة المرور الجديدة
        nameAr: data.personalInfo.nameAr,
        nameEn: data.personalInfo.nameEn,
        titleAr: data.personalInfo.titleAr,
        titleEn: data.personalInfo.titleEn,
        bioAr: data.personalInfo.bioAr,
        bioEn: data.personalInfo.bioEn,
        phone: data.contactInfo.phone,
        email: data.contactInfo.email,
        linkedin: data.contactInfo.linkedin,
        github: data.contactInfo.github,
      }
    });

    await prisma.$transaction([
      prisma.skill.deleteMany(),
      prisma.skill.createMany({ data: data.skills.map((s: any) => ({ nameAr: s.nameAr, nameEn: s.nameEn })) }),
      
      prisma.language.deleteMany(),
      prisma.language.createMany({ data: data.languages.map((l: any) => ({ nameAr: l.nameAr, nameEn: l.nameEn, levelAr: l.levelAr, levelEn: l.levelEn })) }),
      
      prisma.experience.deleteMany(),
      prisma.experience.createMany({ data: data.experiences.map((exp: any) => ({ 
        titleAr: exp.titleAr, titleEn: exp.titleEn, 
        badgeAr: exp.badgeAr, badgeEn: exp.badgeEn, 
        descriptionAr: exp.descriptionAr, descriptionEn: exp.descriptionEn 
      })) }),
      
      prisma.project.deleteMany(),
      prisma.project.createMany({ data: data.projects.map((p: any) => ({ titleAr: p.titleAr, titleEn: p.titleEn, link: p.link })) })
    ]);

    return { success: true };
  } catch (error) {
    console.error("خطأ في حفظ البيانات:", error);
    return { success: false };
  }
}