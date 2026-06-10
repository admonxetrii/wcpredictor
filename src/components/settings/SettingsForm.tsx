"use client";

import { useState } from "react";
import { UserCircle, KeyRound, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changePassword, updateAvatar } from "@/app/settings/actions";

interface SettingsFormProps {
  username: string | null;
  email: string | null;
  image: string | null;
  hasPassword: boolean;
}

export default function SettingsForm({ username, email, image, hasPassword }: SettingsFormProps) {
  const [avatarPreview, setAvatarPreview] = useState(image);
  const [isUploading, setIsUploading] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isUsernameSubmitting, setIsUsernameSubmitting] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) { // 1MB max
      toast.error("Image must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", base64);
        const promise = updateAvatar(formData);
        toast.promise(promise, {
          loading: "Updating avatar...",
          success: "Avatar updated successfully!",
          error: (err) => err.message || "Failed to update avatar",
        });
        await promise;
      } catch {
        setAvatarPreview(image); // revert
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPasswordSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const promise = changePassword(formData);
    toast.promise(promise, {
      loading: "Updating password...",
      success: "Password updated successfully!",
      error: (err) => err.message || "Failed to update password",
    });
    
    try {
      await promise;
      (e.target as HTMLFormElement).reset();
    } catch {} finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Profile Info Section */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-vintage-gold/20 p-3 rounded-full text-vintage-gold">
            <UserCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-vintage-cream">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-sm font-medium text-vintage-cream/60 mb-2">Avatar</label>
            <div className="flex items-center gap-6">
              <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-vintage-gold/50 bg-black/40 flex-shrink-0">
                {avatarPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-12 h-12 text-vintage-cream/30" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-vintage-gold animate-spin" />
                  </div>
                )}
                <label className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center ${isUploading ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'} transition-opacity`}>
                  {!isUploading && (
                    <>
                      <Upload className="w-6 h-6 text-vintage-gold mb-1" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white">Upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
                </label>
              </div>
              <div className="text-xs text-vintage-cream/40 max-w-[200px]">
                Click the image to upload a new avatar. Max size: 1MB. (Square recommended)
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-vintage-cream/60 mb-2">Username</label>
              {username ? (
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90">
                  {username}
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsUsernameSubmitting(true);
                    const fd = new FormData(e.currentTarget);
                    try {
                      const p = import("@/app/settings/actions").then(m => m.setUsername(fd));
                      toast.promise(p, {
                        loading: 'Setting username...',
                        success: 'Username set successfully!',
                        error: (err) => err.message || 'Failed to set username'
                      });
                      await p;
                    } catch {} finally {
                      setIsUsernameSubmitting(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input 
                    name="username" 
                    required 
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-vintage-gold focus:border-vintage-gold text-white shadow-inner" 
                    placeholder="Enter username" 
                    disabled={isUsernameSubmitting}
                    minLength={5}
                    maxLength={30}
                    pattern="[a-zA-Z0-9]+"
                    title="Username must be at least 5 characters and contain only letters and numbers"
                  />
                  <button type="submit" disabled={isUsernameSubmitting} className="flex items-center justify-center px-4 py-3 bg-vintage-gold text-vintage-charcoal font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none">
                    {isUsernameSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Set"}
                  </button>
                </form>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-vintage-cream/60 mb-2">Email</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90">
                {email || <span className="italic text-white/40">Not available</span>}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-vintage-cream/40">Note: Usernames and emails cannot be changed once set.</p>
      </div>

      {/* Security Section */}
      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-vintage-gold/20 p-3 rounded-full text-vintage-gold">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-vintage-cream">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6 w-full">
          {hasPassword && (
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-vintage-cream/80 mb-2">Current Password</label>
              <input 
                type="password" 
                id="currentPassword"
                name="currentPassword"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-vintage-gold focus:border-vintage-gold text-white shadow-inner"
                placeholder="••••••••"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-vintage-cream/80 mb-2">New Password</label>
            <input 
              type="password" 
              id="newPassword"
              name="newPassword"
              required
              minLength={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-vintage-gold focus:border-vintage-gold text-white shadow-inner"
              placeholder="••••••••"
            />
            <p className="mt-2 text-xs text-vintage-cream/60">
              Must be at least 8 characters and include uppercase, lowercase, number, and a special character.
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-vintage-cream/80 mb-2">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-vintage-gold focus:border-vintage-gold text-white shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={isPasswordSubmitting}
            className="w-full flex justify-center items-center py-3 rounded-xl bg-gradient-to-r from-vintage-gold to-yellow-500 text-vintage-charcoal font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPasswordSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Updating...
              </>
            ) : (
              hasPassword ? "Update Password" : "Set Password"
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
