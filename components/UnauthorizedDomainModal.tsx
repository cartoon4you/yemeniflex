'use client';

import React, { useState } from 'react';
import { ShieldAlert, ExternalLink, Copy, Check, X, Info } from 'lucide-react';
import firebaseConfig from '@/firebase-applet-config.json';

interface UnauthorizedDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
  errorType?: 'unauthorized-domain' | 'internal-error' | 'general';
}

export default function UnauthorizedDomainModal({
  isOpen,
  onClose,
  domain,
  errorType = 'unauthorized-domain',
}: UnauthorizedDomainModalProps) {
  const [copied, setCopied] = useState(false);
  const currentDomain =
    domain || (typeof window !== 'undefined' ? window.location.hostname : '');
  const projectId = firebaseConfig.projectId || 'gen-lang-client-0309936280';
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  if (!isOpen) return null;

  const handleCopy = () => {
    if (currentDomain) {
      navigator.clipboard.writeText(currentDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isInternalError = errorType === 'internal-error';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-neutral-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-right overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-950/80 text-red-500 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isInternalError
                  ? 'خطأ مصادقة Firebase (Auth Internal Error)'
                  : 'تأكيد نطاق Firebase Auth'}
              </h3>
              <p className="text-xs text-neutral-400 dir-ltr text-right">
                Firebase: Error ({isInternalError ? 'auth/internal-error' : 'auth/unauthorized-domain'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            {isInternalError
              ? 'حدث خطأ في الاتصال بخدمة Firebase. غالباً ما يحدث هذا بسبب عدم إضافة النطاق المؤقت في Firebase Console أو بسبب تقييد الإطارات/النوافذ المنبثقة.'
              : 'يتطلب تسجيل الدخول بـ Google توثيق هذا النطاق المؤقت في مشروع Firebase الخاص بك للسماح بعملية المصادقة.'}
          </div>
        </div>

        {/* Domain Copy Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 block">
            النطاق الحقيقي المطلوب إضافته:
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <code className="text-xs font-mono text-red-400 font-semibold flex-1 truncate dir-ltr text-left px-1">
              {currentDomain}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-300" />
                  <span>نسخ النطاق</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 text-xs text-neutral-300 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
          <p className="font-bold text-neutral-200 mb-1">
            خطوات التفعيل والتغلب على المشكلة:
          </p>
          <ol className="space-y-2 list-decimal list-inside text-neutral-400">
            <li>
              افتح{' '}
              <a
                href={consoleUrl}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 underline font-semibold hover:text-red-300"
              >
                إعدادات Firebase Console
              </a>
            </li>
            <li>
              انتقل إلى قسم{' '}
              <strong className="text-neutral-200">Authorized Domains (النطاقات المصرح بها)</strong>
            </li>
            <li>
              اضغط على <strong className="text-neutral-200">Add domain</strong> والصق النطاق المنسوخ أعلاه (<span className="dir-ltr inline-block font-mono text-neutral-300">{currentDomain}</span>).
            </li>
            {isInternalError && (
              <li>
                إذا استمرت المشكلة، يرجى فتح التطبيق في <strong className="text-neutral-200">نافذة مستقلة (Tab جديد)</strong> أو التأكد من السماح بالنوافذ المنبثقة (Popups).
              </li>
            )}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-950/40 transition active:scale-95"
          >
            <span>فتح Firebase Console</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
