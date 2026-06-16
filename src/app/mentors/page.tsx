'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Lock, Sparkles, Check, Mail, UserCheck, ShieldAlert } from 'lucide-react';

interface MockMentor {
  name: string;
  role: string;
  prevCompany: string;
  tags: string[];
  avatarColor: string;
}

export default function MentorsPage() {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Tech & Architecture');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const mockMentors: MockMentor[] = [
    {
      name: 'Alex Rivera',
      role: 'SaaS Founder & Builder',
      prevCompany: 'Exited $40M DevTool Startup',
      tags: ['SaaS', 'Node.js', 'Go-To-Market'],
      avatarColor: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Elena Rostova',
      role: 'Product Strategy Lead',
      prevCompany: 'Ex-Stripe / Airbnb Product',
      tags: ['Product-Led Growth', 'UX Design', 'API Design'],
      avatarColor: 'from-[#B4F052] to-emerald-600'
    },
    {
      name: 'Marcus Vance',
      role: 'General Partner',
      prevCompany: 'Unicorn Ventures / Angel Investor',
      tags: ['Fundraising', 'B2B Sales', 'Pitch Prep'],
      avatarColor: 'from-purple-500 to-pink-600'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Save to localStorage to mock subscription
    localStorage.setItem('mentor-waitlist-email', email);
    localStorage.setItem('mentor-waitlist-interest', interest);
    setSubmitted(true);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#B4F052] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-[#B4F052] text-xs font-semibold mb-3">
            <Sparkles size={12} className="animate-pulse" />
            Marketplace Modules
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mentors Marketplace</h1>
          <p className="text-sm text-white/50 mt-1 max-w-xl">
            Connect with vetted experts, operators, and advisors who have scaled startups from 0 to 1.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Coming Soon Information & Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 relative overflow-hidden border-[#B4F052]/20 shadow-[0_0_50px_rgba(180,240,82,0.03)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B4F052]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="w-12 h-12 rounded-xl bg-[#B4F052]/10 border border-[#B4F052]/20 flex items-center justify-center text-[#B4F052] mb-6">
              <GraduationCap size={24} />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Onboarding Top-Tier Mentors</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              We are currently vetting and onboarding experienced advisors to launch the official Mentors Marketplace.
              Once live, you will be able to book 1-on-1 office hours, request pitch deck reviews, and matching sessions with subject experts.
            </p>

            {/* Waiting List Signup */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Get notified when we launch
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/40 font-semibold mb-1 uppercase tracking-wider">
                      Area of Interest
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-[#B4F052]/40"
                    >
                      <option value="Tech & Architecture">Tech & Architecture</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Marketing & Growth">Marketing & Growth</option>
                      <option value="Fundraising & Pitch">Fundraising & Pitch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/40 font-semibold mb-1 uppercase tracking-wider">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="founder@startup.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#B4F052] text-black font-extrabold rounded-xl text-xs hover:opacity-95 shadow-lg shadow-[#B4F052]/10 hover:shadow-[#B4F052]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail size={13} />
                  Join Early Access Waitlist
                </button>
              </form>
            ) : (
              <div className="bg-[#B4F052]/5 border border-[#B4F052]/20 rounded-xl p-5 flex items-start gap-3 animate-fade-in max-w-md">
                <div className="w-8 h-8 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 flex items-center justify-center text-[#B4F052] shrink-0">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">You are on the waitlist!</h4>
                  <p className="text-xs text-white/50 mt-1">
                    We&apos;ll email you at <strong className="text-white">{email}</strong> as soon as mentors in the <strong className="text-[#B4F052]">{interest}</strong> space become available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Mock / Sneak Peek Mentors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/30 uppercase tracking-wider">Sneak Peek</span>
            <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>

          <div className="space-y-3 relative">
            {/* Absolute overlay over the cards to enhance locked/blurred feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-10 rounded-2xl" />
            
            {mockMentors.map((mentor, index) => (
              <div 
                key={index}
                className="relative glass-card p-4 border-white/[0.04] bg-white/[0.01] blur-[1px] select-none hover:blur-[0.5px] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mentor.avatarColor} flex items-center justify-center font-bold text-black`}>
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white/80">{mentor.name}</h3>
                    <p className="text-[11px] text-white/40">{mentor.role}</p>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-white/30 border-t border-white/[0.04] pt-2 italic">
                  {mentor.prevCompany}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {mentor.tags.map(tag => (
                    <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/40 border border-white/[0.06]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
