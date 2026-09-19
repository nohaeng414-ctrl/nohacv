'use client';


import React, { useState, useEffect } from 'react';
import { verifyAdminPassword, getDashboardData, saveDashboardData } from './actions';
import { Eye, EyeOff } from 'lucide-react'; 

export default function EditProfilePage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // حالات إظهار/إخفاء كلمة المرور
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // إعدادات كلمة المرور الجديدة
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // 1. البيانات الأساسية (عربي / إنجليزي)
  const [personalInfo, setPersonalInfo] = useState({
    nameAr: '', nameEn: '',
    titleAr: '', titleEn: '',
    bioAr: '', bioEn: ''
  });

  // 2. معلومات التواصل
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '', linkedin: '', github: '' });

  // 3. المهارات التقنية (عربي / إنجليزي)
  const [skills, setSkills] = useState<{ nameAr: string; nameEn: string }[]>([]);
  const [newSkillAr, setNewSkillAr] = useState('');
  const [newSkillEn, setNewSkillEn] = useState('');

  // 4. اللغات
  const [languages, setLanguages] = useState<any[]>([]);
  const [newLanguage, setNewLanguage] = useState({ nameAr: '', nameEn: '', levelAr: '', levelEn: '' });

  // 5. المسار المهني
  const [experiences, setExperiences] = useState<any[]>([]);
  const [newExperience, setNewExperience] = useState({ titleAr: '', titleEn: '', badgeAr: '', badgeEn: '', descriptionAr: '', descriptionEn: '' });

  // 6. المشاريع والأعمال
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({ titleAr: '', titleEn: '', link: '' });

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const dbData = await getDashboardData();
      
      if (dbData.profile) {
        setNewAdminPassword(dbData.profile.password || 'niceme');
        setPersonalInfo({
          nameAr: dbData.profile.nameAr || '',
          nameEn: dbData.profile.nameEn || '',
          titleAr: dbData.profile.titleAr || '',
          titleEn: dbData.profile.titleEn || '',
          bioAr: dbData.profile.bioAr || '',
          bioEn: dbData.profile.bioEn || ''
        });
        setContactInfo({
          phone: dbData.profile.phone || '',
          email: dbData.profile.email || '',
          linkedin: dbData.profile.linkedin || '',
          github: dbData.profile.github || ''
        });
      }
      
      setSkills(dbData.skills);
      setLanguages(dbData.languages);
      setExperiences(dbData.experiences);
      setProjects(dbData.projects);
      
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = await verifyAdminPassword(password);
    if (isCorrect) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveDashboardData({
      password: newAdminPassword,
      personalInfo,
      contactInfo,
      skills,
      languages,
      experiences,
      projects
    });

    setIsSaving(false);
    if (result.success) {
      alert('تم حفظ جميع التعديلات وتحديث اللغات وكلمة المرور بنجاح في قاعدة البيانات!');
    } else {
      alert('حدث خطأ أثناء الحفظ، يرجى التحقق من المدخلات.');
    }
  };

  // دوال الإضافة والحذف للقوائم
  const handleAddSkill = () => {
    if (newSkillAr.trim() && newSkillEn.trim()) {
      setSkills([...skills, { nameAr: newSkillAr.trim(), nameEn: newSkillEn.trim() }]);
      setNewSkillAr('');
      setNewSkillEn('');
    }
  };
  const handleRemoveSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  const handleAddLanguage = () => {
    if (newLanguage.nameAr.trim()) {
      setLanguages([...languages, { id: Date.now(), ...newLanguage }]);
      setNewLanguage({ nameAr: '', nameEn: '', levelAr: '', levelEn: '' });
    }
  };
  const handleRemoveLanguage = (id: number) => setLanguages(languages.filter(l => l.id !== id));

  const handleAddExperience = () => {
    if (newExperience.titleAr.trim()) {
      setExperiences([...experiences, { id: Date.now(), ...newExperience }]);
      setNewExperience({ titleAr: '', titleEn: '', badgeAr: '', badgeEn: '', descriptionAr: '', descriptionEn: '' });
    }
  };
  const handleRemoveExperience = (id: number) => setExperiences(experiences.filter(exp => exp.id !== id));

  const handleAddProject = () => {
    if (newProject.titleAr.trim()) {
      setProjects([...projects, { id: Date.now(), ...newProject }]);
      setNewProject({ titleAr: '', titleEn: '', link: '' });
    }
  };
  const handleRemoveProject = (id: number) => setProjects(projects.filter(p => p.id !== id));


  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-pink-100 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">تسجيل الدخول لوحة التحكم</h1>
          <p className="text-sm text-zinc-500 mb-6">أدخلي كلمة المرور للوصول والتحكم بالبروفايل</p>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* حقل كلمة المرور مع زر الإخفاء والإظهار */}
            <div className="relative">
              <input 
                type={showLoginPassword ? "text" : "password"} 
                placeholder="كلمة المرور..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={`w-full bg-zinc-50 border ${loginError ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-pink-500`} 
                dir="ltr" 
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-sm font-semibold"
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {loginError && <p className="text-red-500 text-xs font-semibold">كلمة المرور غير صحيحة.</p>}
            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-colors">دخول</button>
          </form>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-600 font-bold">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8F9FA] text-zinc-800 py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* الشريط العلوي */}
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 sticky top-4 z-10">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">لوحة التحكم</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsAuthenticated(false)} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">خروج</button>
            <button onClick={handleSave} disabled={isSaving} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm">
              {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </header>

        {/* إعدادات كلمة المرور مع زر الإخفاء والإظهار */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-4">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">إعدادات الأمان (كلمة المرور)</h2>
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-zinc-700 mb-2">تغيير كلمة مرور لوحة التحكم</label>
            <div className="relative">
              <input 
                type={showAdminPassword ? "text" : "password"} 
                value={newAdminPassword} 
                onChange={(e) => setNewAdminPassword(e.target.value)} 
className={`w-full bg-zinc-50 border ${loginError ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 pl-12 text-center text-lg focus:outline-none focus:ring-2 focus:ring-pink-500`}                
              />
             
             
             
              <button 
                type="button" 
                onClick={() => setShowAdminPassword(!showAdminPassword)} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-sm font-semibold"
              >
{showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}              </button>
            </div>
          </div>
        </section>

        {/* 1. البيانات الأساسية */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">البيانات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1">الاسم (بالعربية)</label><input type="text" value={personalInfo.nameAr} onChange={(e) => setPersonalInfo({...personalInfo, nameAr: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm font-semibold mb-1">الاسم (بالإنجليزية)</label><input type="text" value={personalInfo.nameEn} onChange={(e) => setPersonalInfo({...personalInfo, nameEn: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2" dir="ltr" /></div>
            <div><label className="block text-sm font-semibold mb-1">المسمى (بالعربية)</label><input type="text" value={personalInfo.titleAr} onChange={(e) => setPersonalInfo({...personalInfo, titleAr: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm font-semibold mb-1">المسمى (بالإنجليزية)</label><input type="text" value={personalInfo.titleEn} onChange={(e) => setPersonalInfo({...personalInfo, titleEn: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1">النبذة (بالعربية)</label><textarea rows={3} value={personalInfo.bioAr} onChange={(e) => setPersonalInfo({...personalInfo, bioAr: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 resize-none"></textarea></div>
            <div><label className="block text-sm font-semibold mb-1">النبذة (بالإنجليزية)</label><textarea rows={3} value={personalInfo.bioEn} onChange={(e) => setPersonalInfo({...personalInfo, bioEn: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 resize-none" dir="ltr"></textarea></div>
          </div>
        </section>

        {/* 2. معلومات التواصل */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">معلومات التواصل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1">الهاتف</label><input type="text" dir="ltr" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-left" /></div>
            <div><label className="block text-sm font-semibold mb-1">البريد</label><input type="email" dir="ltr" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-left" /></div>
            <div><label className="block text-sm font-semibold mb-1">LinkedIn</label><input type="text" dir="ltr" value={contactInfo.linkedin} onChange={(e) => setContactInfo({...contactInfo, linkedin: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-left" /></div>
            <div><label className="block text-sm font-semibold mb-1">GitHub</label><input type="text" dir="ltr" value={contactInfo.github} onChange={(e) => setContactInfo({...contactInfo, github: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-left" /></div>
          </div>
        </section>

        {/* 3. المهارات */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-4">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">المهارات التقنية</h2>
          {/* المهارات التقنية */}
          <div className="flex flex-wrap gap-2 mb-4" dir="ltr">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1.5 rounded-lg text-sm">
                <span>{skill.nameAr} / {skill.nameEn}</span>
                <button onClick={() => handleRemoveSkill(idx)} className="text-pink-400 hover:text-red-500 font-bold">×</button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="المهارة" value={newSkillAr} onChange={(e) => setNewSkillAr(e.target.value)} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2"  dir="ltr" />
            <input type="text" placeholder="Skill" value={newSkillEn} onChange={(e) => setNewSkillEn(e.target.value)} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2" dir="ltr" />
          </div>
          <button onClick={handleAddSkill} className="w-full bg-zinc-800 text-white py-2.5 rounded-xl font-bold text-sm">إضافة مهارة</button>
        </section>

        {/* 4. اللغات */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-4">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">اللغات</h2>
          <div className="space-y-2 mb-4">
            {languages.map((lang, idx) => (
              <div key={lang.id || idx} className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl text-sm">
                <span>{lang.nameAr} ({lang.levelAr}) - {lang.nameEn} ({lang.levelEn})</span>
                <button onClick={() => handleRemoveLanguage(lang.id)} className="text-red-500 font-bold">حذف</button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <input type="text" placeholder="اللغة" value={newLanguage.nameAr} onChange={(e) => setNewLanguage({...newLanguage, nameAr: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm" />
            <input type="text" placeholder="المستوى" value={newLanguage.levelAr} onChange={(e) => setNewLanguage({...newLanguage, levelAr: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm" />
            <input type="text" placeholder="Language" value={newLanguage.nameEn} onChange={(e) => setNewLanguage({...newLanguage, nameEn: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm" dir="ltr" />
            <input type="text" placeholder="Level" value={newLanguage.levelEn} onChange={(e) => setNewLanguage({...newLanguage, levelEn: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm" dir="ltr" />
          </div>
          <button onClick={handleAddLanguage} className="w-full bg-zinc-800 text-white py-2.5 rounded-xl font-bold text-sm">إضافة لغة جديدة</button>
        </section>

        {/* 5. المسار المهني */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-4">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">المسار المهني والخبرات</h2>
          <div className="space-y-3 mb-4">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="flex justify-between items-start bg-zinc-50 p-4 rounded-xl text-sm">
                <div>
                  <p className="font-bold">{exp.titleAr} | <span className="text-pink-600">{exp.badgeAr}</span></p>
                  <p className="text-zinc-500 text-xs mt-1">{exp.descriptionAr}</p>
                </div>
                <button onClick={() => handleRemoveExperience(exp.id)} className="text-red-500 font-bold">حذف</button>
              </div>
            ))}
          </div>
          <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="text" placeholder="المسمى الوظيفي" value={newExperience.titleAr} onChange={(e) => setNewExperience({...newExperience, titleAr: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm" />
              <input type="text" placeholder="Job Title" value={newExperience.titleEn} onChange={(e) => setNewExperience({...newExperience, titleEn: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm" dir="ltr" />
              <input type="text" placeholder="العلامة أو الفترة" value={newExperience.badgeAr} onChange={(e) => setNewExperience({...newExperience, badgeAr: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm" />
              <input type="text" placeholder="Badge" value={newExperience.badgeEn} onChange={(e) => setNewExperience({...newExperience, badgeEn: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm" dir="ltr" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <textarea placeholder="الوصف" rows={2} value={newExperience.descriptionAr} onChange={(e) => setNewExperience({...newExperience, descriptionAr: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm resize-none"></textarea>
              <textarea placeholder="Description" rows={2} value={newExperience.descriptionEn} onChange={(e) => setNewExperience({...newExperience, descriptionEn: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm resize-none" dir="ltr"></textarea>
            </div>
            <button onClick={handleAddExperience} className="w-full bg-zinc-800 text-white py-2.5 rounded-xl font-bold text-sm">إضافة خبرة</button>
          </div>
        </section>

        {/* 6. المشاريع والأعمال */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-4">
          <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">المشاريع والأعمال</h2>
          <div className="space-y-2 mb-4">
            {projects.map((project, idx) => (
              <div key={project.id || idx} className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl text-sm">
                <span>{project.titleAr} / {project.titleEn}</span>
                <button onClick={() => handleRemoveProject(project.id)} className="text-red-500 font-bold">حذف</button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" placeholder="اسم المشروع" value={newProject.titleAr} onChange={(e) => setNewProject({...newProject, titleAr: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm" />
            <input type="text" placeholder="Project Name " value={newProject.titleEn} onChange={(e) => setNewProject({...newProject, titleEn: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm" dir="ltr" />
            <input type="text" placeholder="رابط المشروع (https://...)" value={newProject.link} onChange={(e) => setNewProject({...newProject, link: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm text-left" dir="ltr" />
          </div>
          <button onClick={handleAddProject} className="w-full bg-zinc-800 text-white py-2.5 rounded-xl font-bold text-sm">إضافة مشروع</button>
        </section>

      </div>
    </div>
  );
}