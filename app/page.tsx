'use client';

import React, { useState, useEffect } from 'react';
// استيراد دوال السيرفر التي قمنا بإنشائها
import { verifyAdminPassword, getDashboardData, saveDashboardData } from './actions';

export default function EditProfilePage() {
  // حالات تسجيل الدخول والتحميل
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. البيانات الأساسية
  const [personalInfo, setPersonalInfo] = useState({ name: '', title: '', bio: '' });

  // 2. معلومات التواصل
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '', linkedin: '', github: '' });

  // 3. المهارات
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // 4. اللغات
  const [languages, setLanguages] = useState<any[]>([]);
  const [newLanguage, setNewLanguage] = useState({ name: '', level: '' });

  // 5. المسار المهني
  const [experiences, setExperiences] = useState<any[]>([]);
  const [newExperience, setNewExperience] = useState({ title: '', badge: '', description: '' });

  // 6. المشاريع والأعمال
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({ title: '', link: '' });

  // جلب البيانات من قاعدة البيانات عند نجاح تسجيل الدخول
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
        setPersonalInfo({
          name: dbData.profile.name || '',
          title: dbData.profile.title || '',
          bio: dbData.profile.bio || ''
        });
        setContactInfo({
          phone: dbData.profile.phone || '',
          email: dbData.profile.email || '',
          linkedin: dbData.profile.linkedin || '',
          github: dbData.profile.github || ''
        });
      }
      
      setSkills(dbData.skills.map((s: any) => s.name));
      setLanguages(dbData.languages);
      setExperiences(dbData.experiences);
      setProjects(dbData.projects);
      
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
    setIsLoading(false);
  };

  // دالة تسجيل الدخول
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

  // دالة حفظ التعديلات في قاعدة البيانات
  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveDashboardData({
      personalInfo,
      contactInfo,
      skills,
      languages,
      experiences,
      projects
    });

    setIsSaving(false);
    if (success) {
      alert('تم حفظ التعديلات بنجاح في قاعدة البيانات!');
    } else {
      alert('حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.');
    }
  };

  // دوال الإضافة والحذف السريعة (في المتصفح)
  const handleAddSkill = () => { if (newSkill.trim() && !skills.includes(newSkill)) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };
  const handleRemoveSkill = (skillToRemove: string) => setSkills(skills.filter(s => s !== skillToRemove));

  const handleAddLanguage = () => { if (newLanguage.name.trim() && newLanguage.level.trim()) { setLanguages([...languages, { id: Date.now(), ...newLanguage }]); setNewLanguage({ name: '', level: '' }); } };
  const handleRemoveLanguage = (id: number) => setLanguages(languages.filter(l => l.id !== id));

  const handleAddExperience = () => { if (newExperience.title.trim()) { setExperiences([...experiences, { id: Date.now(), ...newExperience }]); setNewExperience({ title: '', badge: '', description: '' }); } };
  const handleRemoveExperience = (id: number) => setExperiences(experiences.filter(exp => exp.id !== id));

  const handleAddProject = () => { if (newProject.title.trim()) { setProjects([...projects, { id: Date.now(), ...newProject }]); setNewProject({ title: '', link: '' }); } };
  const handleRemoveProject = (id: number) => setProjects(projects.filter(p => p.id !== id));


  if (!isAuthenticated) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700&display=swap');
          .font-alexandria { font-family: 'Alexandria', sans-serif; }
        `}</style>
        <main dir="rtl" className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-alexandria px-4">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-pink-100 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">تسجيل الدخول</h1>
            <p className="text-sm text-zinc-500 mb-6">الرجاء إدخال كلمة المرور للوصول إلى لوحة التحكم</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input type="password" placeholder="كلمة المرور..." value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full bg-zinc-50 border ${loginError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-pink-500'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 text-center text-lg`} dir="ltr" />
                {loginError && <p className="text-red-500 text-xs mt-2 font-semibold">كلمة المرور غير صحيحة، حاولي مجدداً.</p>}
              </div>
              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm">دخول</button>
            </form>
          </div>
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-600 font-bold font-alexandria">جاري سحب البيانات من السيرفر...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;800&display=swap');
        .font-alexandria { font-family: 'Alexandria', sans-serif; }
      `}</style>
      <div dir="rtl" className="min-h-screen bg-[#F8F9FA] text-zinc-800 font-alexandria py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 sticky top-4 z-10">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">لوحة التحكم</h1>
              <p className="text-sm text-zinc-500 mt-1">إدارة بيانات البروفايل الشخصي بالكامل</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAuthenticated(false)} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors hidden sm:block">تسجيل الخروج</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className={`${isSaving ? 'bg-pink-400' : 'bg-pink-600 hover:bg-pink-700'} text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2`}
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </header>

          {/* 1. البيانات الأساسية */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">البيانات الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-semibold text-zinc-700 mb-2">الاسم</label><input type="text" value={personalInfo.name} onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
              <div><label className="block text-sm font-semibold text-zinc-700 mb-2">المسمى الوظيفي</label><input type="text" value={personalInfo.title} onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
            </div>
            <div><label className="block text-sm font-semibold text-zinc-700 mb-2">نبذة عني</label><textarea rows={4} value={personalInfo.bio} onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none leading-relaxed"></textarea></div>
          </section>

          {/* 2. معلومات التواصل */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">معلومات التواصل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-semibold text-zinc-700 mb-2">رقم الهاتف</label><input type="text" dir="ltr" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left" /></div>
              <div><label className="block text-sm font-semibold text-zinc-700 mb-2">البريد الإلكتروني</label><input type="email" dir="ltr" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left" /></div>
              <div><label className="block text-sm font-semibold text-zinc-700 mb-2">رابط LinkedIn</label><input type="text" dir="ltr" value={contactInfo.linkedin} onChange={(e) => setContactInfo({...contactInfo, linkedin: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left" /></div>
              <div><label className="block text-sm font-semibold text-zinc-700 mb-2">رابط GitHub</label><input type="text" dir="ltr" value={contactInfo.github} onChange={(e) => setContactInfo({...contactInfo, github: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left" /></div>
            </div>
          </section>

          {/* 3. المهارات التقنية */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">المهارات التقنية</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveSkill(skill)} className="text-pink-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input type="text" placeholder="إضافة مهارة تقنية جديدة..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()} className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <button onClick={handleAddSkill} className="bg-zinc-800 hover:bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">إضافة</button>
            </div>
          </section>

          {/* 4. اللغات */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">إدارة اللغات</h2>
            <div className="space-y-3 mb-6">
              {languages.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-center bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                  <div><span className="font-bold text-zinc-800">{lang.name}</span><span className="text-sm text-zinc-500 mr-3">({lang.level})</span></div>
                  <button onClick={() => handleRemoveLanguage(lang.id)} className="text-zinc-400 hover:text-red-500 p-2 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="اسم اللغة (مثال: الفرنسية)" value={newLanguage.name} onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <input type="text" placeholder="المستوى (مثال: مبتدئ، متقدم)" value={newLanguage.level} onChange={(e) => setNewLanguage({...newLanguage, level: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <button onClick={handleAddLanguage} className="w-full bg-zinc-800 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors">إضافة لغة جديدة</button>
          </section>

          {/* 5. المسار المهني */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">المسار المهني والخبرات</h2>
            <div className="space-y-4 mb-6">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="flex justify-between items-start bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-zinc-800">{exp.title}</h4>
                      <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">{exp.badge}</span>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">{exp.description}</p>
                  </div>
                  <button onClick={() => handleRemoveExperience(exp.id)} className="text-zinc-400 hover:text-red-500 p-2 transition-colors shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              ))}
            </div>
            <div className="space-y-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="المسمى (مثال: تطوير الويب)" value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" placeholder="الفترة أو المكان (مثال: مشاريع مستقلة)" value={newExperience.badge} onChange={(e) => setNewExperience({...newExperience, badge: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <textarea placeholder="وصف الخبرة والمهام..." rows={3} value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"></textarea>
              <button onClick={handleAddExperience} className="w-full bg-zinc-800 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors">إضافة خبرة جديدة</button>
            </div>
          </section>

          {/* 6. الأعمال والمشاريع */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-bold text-pink-700 border-b border-pink-100 pb-2">الأعمال والمشاريع</h2>
            <div className="space-y-3 mb-6">
              {projects.map((project, idx) => (
                <div key={project.id || idx} className="flex justify-between items-center bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                  <div className="truncate pl-4">
                    <h4 className="font-bold text-zinc-800 truncate">{project.title}</h4>
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-pink-600 hover:underline truncate inline-block w-full text-left mt-1" dir="ltr">{project.link}</a>
                  </div>
                  <button onClick={() => handleRemoveProject(project.id)} className="text-zinc-400 hover:text-red-500 p-2 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="اسم المشروع..." value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <input type="text" placeholder="رابط المشروع (https://...)" value={newProject.link} onChange={(e) => setNewProject({...newProject, link: e.target.value})} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left" dir="ltr" />
            </div>
            <button onClick={handleAddProject} className="w-full bg-zinc-800 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors">إضافة مشروع جديد</button>
          </section>

        </div>
      </div>
    </>
  );
}