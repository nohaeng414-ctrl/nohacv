'use client';

import React, { useState } from 'react';

export default function ClientProfile({ initialData }: { initialData: any }) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const toggleLanguage = () => setLang(lang === 'ar' ? 'en' : 'ar');

  const { profile, skills, languages, experiences, projects } = initialData;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;800&display=swap');
        .font-alexandria { font-family: 'Alexandria', sans-serif; }
      `}</style>

      <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F8F9FA] text-zinc-800 font-alexandria py-8 px-4 sm:px-8 transition-all duration-300">
       {/* شريط التحكم العلوي */}
       <div className={`max-w-6xl mx-auto flex items-center mb-4 ${lang === 'ar' ?  'justify-end':'justify-end' }`}>
          <button 
            onClick={toggleLanguage}
            className="bg-pink-50 text-pink-700 hover:bg-pink-700 hover:text-white px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 shadow-sm"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
        

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* الجانب الأيمن: البطاقة الشخصية، التواصل، المهارات، اللغات */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-pink-800 text-white rounded-3xl p-8 shadow-lg border border-pink-700 lg:sticky lg:top-12">
              
              <h1 className="text-3xl font-extrabold text-white mb-2">
                {lang === 'ar' ? profile?.nameAr : profile?.nameEn}
              </h1>
              <h2 className="text-sm font-semibold text-pink-200 mb-6 tracking-wider">
                {lang === 'ar' ? profile?.titleAr : profile?.titleEn}
              </h2>

              {/* معلومات التواصل */}
              <div className="space-y-4 text-sm text-pink-50 mb-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {lang === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}
                </div>
                
                {profile?.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-3 hover:text-white transition-colors">
                    <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className={`w-full font-sans ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{profile.phone}</span>
                  </a>
                )}

                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                    <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-sans break-all">{profile.email}</span>
                  </a>
                )}

{profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                    <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn
                  </a>
                )}

                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                    <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                )}
              </div>

              <hr className="border-pink-600/50 mb-6" />

             {/* المهارات */}
             <h3 className="font-bold text-white mb-4 text-lg">{lang === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: any, idx: number) => (
                  <span key={idx} className="bg-pink-700/50 text-pink-50 border border-pink-600/50 px-3 py-1.5 rounded-lg text-xs font-semibold inline-block" dir="ltr">
                    {lang === 'ar' ? skill.nameAr : skill.nameEn}
                  </span>
                ))}
              </div>
              
              {/* اللغات */}
              <hr className="border-pink-600/50 my-6" />
              <h3 className="font-bold text-white mb-4 text-lg">{lang === 'ar' ? 'اللغات' : 'Languages'}</h3>
              <div className="flex flex-col gap-3 text-sm">
                {languages.map((langItem: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-pink-700/30 px-4 py-2.5 rounded-xl border border-pink-600/30">
                    <span className="font-semibold text-pink-50">{lang === 'ar' ? langItem.nameAr : langItem.nameEn}</span>
                    <span className="text-xs text-pink-200">{lang === 'ar' ? langItem.levelAr : langItem.levelEn}</span>
                  </div>
                ))}
              </div>
              
            </div>
          </aside>

          {/* الجانب الأيسر: النبذة، الخبرات، التعليم، الأعمال */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* النبذة */}
            <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-4 border-b-2 border-pink-500 inline-block pb-1">
                {lang === 'ar' ? 'نبذة عني' : 'About Me'}
              </h3>
              <p className="text-zinc-600 leading-8 text-base">
                {lang === 'ar' ? profile?.bioAr : profile?.bioEn}
              </p>
            </section>

            {/* الخبرات */}
            <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-8 border-b-2 border-pink-500 inline-block pb-1">
                {lang === 'ar' ? 'المسار المهني' : 'Professional Experience'}
              </h3>
              
              <div className="space-y-6">
                {experiences.map((exp: any, idx: number) => (
                  <div key={idx} className={`relative ${lang === 'ar' ? 'border-r-2 pr-5' : 'border-l-2 pl-5'} border-zinc-100`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-zinc-800">{lang === 'ar' ? exp.titleAr : exp.titleEn}</h4>
                      <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-3 py-1 rounded-full w-max mt-1 sm:mt-0">{lang === 'ar' ? exp.badgeAr : exp.badgeEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* التعليم (تم إضافته ليكون متوافقاً تماماً مع رغبتكِ) */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">
                  {lang === 'ar' ? 'بكالوريوس هندسة معلوماتية' : 'Bachelor of Informatics Engineering'}
                </h3>
                <p className="text-zinc-500 text-sm">
                  {lang === 'ar' ? 'تخصص وسائط متعددة' : 'Multimedia Specialization'}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 font-bold text-zinc-600 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-200">
                {lang === 'ar' ? 'سبتمبر 2019' : 'September 2019'}
              </div>
            </section>

            {/* الأعمال */}
            <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-6 border-b-2 border-pink-500 inline-block pb-1">
                {lang === 'ar' ? 'من أعمالي' : 'My Work'}
              </h3>
              
              <div className="space-y-4">
                {projects.map((project: any, idx: number) => (
                  <a key={idx} href={project.link} target="_blank" rel="noopener noreferrer" className="group block p-6 border border-zinc-100 rounded-2xl hover:border-pink-200 hover:shadow-md transition-all bg-[#FCFCFC] flex items-center justify-between">
                    <h4 className="text-lg font-bold text-pink-700 group-hover:text-pink-600 transition-colors">
                      {lang === 'ar' ? project.titleAr : project.titleEn}
                    </h4>
                    <svg className={`w-5 h-5 text-zinc-400 transform transition-all group-hover:text-pink-500 ${lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </a>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}