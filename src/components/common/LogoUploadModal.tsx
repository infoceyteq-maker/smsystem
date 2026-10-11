import React, { useState } from 'react';
import { X, Upload, Check, RefreshCw, AlertCircle, FileImage } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ isOpen, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ssck_school_logo') || null;
    } catch (_) {
      return null;
    }
  });
  const [urlInput, setUrlInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    // Limit to reasonable size ~2MB for localStorage
    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMsg('Image size is too large (max 2.5MB). Please choose a smaller file.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setErrorMsg(null);
  };

  const handleSave = () => {
    try {
      if (previewUrl) {
        localStorage.setItem('ssck_school_logo', previewUrl);
      } else {
        localStorage.removeItem('ssck_school_logo');
      }
      window.dispatchEvent(new Event('ssck_logo_updated'));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (e) {
      setErrorMsg('Failed to save logo to local storage. Please try a smaller image.');
    }
  };

  const handleResetToDefault = () => {
    setPreviewUrl(null);
    setUrlInput('');
    try {
      localStorage.removeItem('ssck_school_logo');
      window.dispatchEvent(new Event('ssck_logo_updated'));
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0B3C96]">
            <FileImage className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              School Logo & Crest
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Sri Sumangala College Kandy Official Emblem
            </p>
          </div>
        </div>

        {/* College Colors Bar */}
        <div className="w-full h-2 rounded-full overflow-hidden flex mb-5 border border-gray-200">
          <div className="w-1/3 bg-[#0B3C96]" title="Royal Blue" />
          <div className="w-1/3 bg-[#FFC72C]" title="Gold / Yellow" />
          <div className="w-1/3 bg-white border-y border-gray-100" title="Pure White" />
        </div>

        {/* Live Preview Area */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 mb-5">
          <div className="w-20 h-20 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-center p-2">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected School Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <SchoolLogo size="2xl" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-gray-900">
              Sri Sumangala College, Kandy
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {previewUrl
                ? 'Custom school logo image active'
                : 'Default Sri Sumangala College authentic vector crest'}
            </p>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              Colours: Royal Blue · Golden Yellow · White
            </p>
          </div>
        </div>

        {/* File Upload Zone */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Upload Image File (PNG, JPG, SVG)
          </label>
          <label className="border-2 border-dashed border-gray-300 hover:border-[#0B3C96] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-blue-50/30 transition group">
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#0B3C96] mb-1.5 transition" />
            <span className="text-xs font-semibold text-gray-700 group-hover:text-[#0B3C96]">
              Choose School Logo File
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">
              Supports transparent PNG or SVG
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Or Image URL Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Or paste image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/ssck-crest.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApplyUrl}
              type="button"
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
            >
              Apply
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2 mb-4 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Official Crest</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B3C96] hover:bg-[#082C74] text-white shadow-xs transition"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Logo</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
