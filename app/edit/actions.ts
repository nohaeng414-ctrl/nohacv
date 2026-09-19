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
      bioAr: 'أعمل بشغف على بناء حلول برمجية متطورة، تطوير واجهات المستخدم التفاعلية وإدارة قواعد البيانات باستخدام تقنيات حديثة مثل Next.js و React و Prisma.',
      bioEn: 'I passionately build advanced software solutions, develop interactive user interfaces, and manage databases using modern technologies like Next.js, React, and Prisma.',
      phone: '00966530848339',
      email: 'nohaeng414@gmail.com',
      linkedin: 'https://www.linkedin.com/in/%D9%86%D9%87%D9%89-%D8%AD%D8%B3%D9%86-399a49135/',
      github: 'https://github.com/nohaeng414-ctrl'
    }
  });

  // التأكد من جلب القوائم
  let skills = await prisma.skill.findMany();
  let languages = await prisma.language.findMany();
  let experiences = await prisma.experience.findMany();
  let projects = await prisma.project.findMany();

  // إذا كانت القاعدة فارغة، نضع القيم الكاملة تلقائياً
  if (skills.length === 0) {
    await prisma.skill.createMany({
      data: ['Next.js', 'JavaScript', 'SQLite', 'C++', 'C#', 'Java', 'SQL', 'CSS', 'HTTP', 'PHP'].map(s => ({ nameAr: s, nameEn: s }))
    });
    skills = await prisma.skill.findMany();
  }

  if (languages.length === 0) {
    await prisma.language.createMany({
      data: [
        { nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native' },
        { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'مستوى متوسط', levelEn: 'Intermediate' }
      ]
    });
    languages = await prisma.language.findMany();
  }

  if (experiences.length === 0) {
    await prisma.experience.createMany({
      data: [
        { titleAr: 'تطوير الويب', titleEn: 'Web Development', badgeAr: 'مشاريع مستقلة', badgeEn: 'Freelance Projects', descriptionAr: '', descriptionEn: '' },
        { titleAr: 'مدربة قيادة', titleEn: 'Driving Instructor', badgeAr: '(عامين)', badgeEn: '(2 Years)', descriptionAr: '', descriptionEn: '' }
      ]
    });
    experiences = await prisma.experience.findMany();
  }

  if (projects.length === 0) {
    await prisma.project.createMany({
      data: [
        { titleAr: 'رواية "دمشق لنا إلى يوم القيامة"', titleEn: 'Novel "Damascus is Ours Until Judgment Day"', link: 'https://noha-novel-ten.vercel.app/' }
      ]
    });
    projects = await prisma.project.findMany();
  }

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