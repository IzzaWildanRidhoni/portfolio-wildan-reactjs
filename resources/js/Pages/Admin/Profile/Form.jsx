import { useState, useRef, useEffect } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, FormField, Input, Select, TextArea 
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, User, Mail, MapPin, Briefcase, 
    Link2, Github, Linkedin, Instagram, Video, Phone,
    CheckCircle2,
} from 'lucide-react';

// ─── Avatar Uploader (SAME PATTERN as ThumbnailUploader) ─────────────────────

function AvatarUploader({ value, preview, onFileChange, onRemove, error }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onFileChange(file);
        }
    };

    // Handle both string URL (existing) and File object (new upload)
    const displaySrc = preview || (typeof value === 'string' ? value : null);

    return (
        <FormField 
            label="Avatar" 
            error={error}
            hint={<span className="normal-case font-normal">(opsional, maks. 2MB)</span>}
        >
            {displaySrc ? (
                <div className="relative w-full max-w-[180px] group">
                    <div className="rounded-xl overflow-hidden border border-white/[0.08] aspect-square bg-white/[0.03]">
                        <img src={displaySrc} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus avatar"
                    >
                        <X className="w-3.5 h-3.5 text-white" />
                    </button>
                    
                    {/* Change Button */}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-[11px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Upload className="w-3 h-3" />
                        Ganti
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3 w-full max-w-[180px] aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                        dragging
                            ? 'border-indigo-500/60 bg-indigo-500/[0.06]'
                            : 'border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]'
                    }`}
                >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <User className="w-5 h-5 text-white/30" />
                    </div>
                    <div className="text-center">
                        <p className="text-[13px] text-white/50">Klik atau drag & drop</p>
                        <p className="text-[11px] text-white/25 mt-0.5">PNG, JPG, WEBP · maks. 2MB</p>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && onFileChange(e.target.files[0])}
            />
        </FormField>
    );
}

// ─── Main Form Page (SAME PATTERN as Achievements/Form.jsx) ──────────────────

export default function Form({ profile, mode }) {
    const isEdit = mode === 'edit';
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name:           profile?.name || '',
        username:       profile?.username || '',
        title:          profile?.title || '',
        location:       profile?.location || '',
        work_type:      profile?.work_type || '',
        bio:            profile?.bio || '',
        email:          profile?.email || '',
        whatsapp:       profile?.whatsapp || '',
        github:         profile?.github || '',
        linkedin:       profile?.linkedin || '',
        instagram:      profile?.instagram || '',
        tiktok:         profile?.tiktok || '',
        avatar:         null,
        is_verified:    profile?.is_verified || false,
    });

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (file) => {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Hanya file gambar yang diperbolehkan');
            return;
        }

        setData('avatar', file);
        
        // Create preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setData('avatar', null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ✅ FIX: Build FormData manually to control what gets sent
        const formData = new FormData();
        
        // Add all text fields
        Object.entries(data).forEach(([key, value]) => {
            // Skip avatar field - we handle it separately below
            if (key === 'avatar') return;
            // Skip internal Inertia fields
            if (key === '_method') return;
            
            formData.append(key, value);
        });
        
        // ✅ Only append avatar if it's actually a new File upload
        // If avatar is null or a string (existing URL), don't send it
        if (data.avatar instanceof File) {
            formData.append('avatar', data.avatar);
        }
        
        // Add method override for PUT request
        formData.append('_method', isEdit ? 'PUT' : 'POST');

        // Submit via Inertia router
        router.post('/admin/profile', formData, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Cleanup preview URL after successful submit
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
            },
        });
    };

    // Handle avatar display: preview URL > existing string URL > null
    const avatarSrc = previewUrl || (typeof profile?.avatar === 'string' ? profile.avatar : null);

    const WORK_TYPE_OPTIONS = [
        { value: 'fulltime', label: 'Full-time' },
        { value: 'parttime', label: 'Part-time' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'remote', label: 'Remote' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'internship', label: 'Internship' },
    ];

    return (
        <AdminLayout title={isEdit ? 'Edit Profile' : 'Buat Profile'}>
            <div className="max-w-2xl">
                {/* Back Link - SAME PATTERN as Achievements */}
                <Link 
                    href="/admin/profile" 
                    className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Profile' : 'Buat Profile Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
                        
                        {/* Avatar Upload */}
                        <AvatarUploader
                            value={avatarSrc}
                            preview={previewUrl}
                            onFileChange={handleFileChange}
                            onRemove={handleRemoveAvatar}
                            error={errors.avatar}
                        />

                        <div className="border-t border-white/[0.06]" />

                        {/* Name + Username */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Nama Lengkap" required error={errors.name}>
                                <Input
                                    icon={User}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nama lengkap Anda"
                                    error={errors.name}
                                    autoComplete="name"
                                />
                            </FormField>
                            <FormField label="Username" required error={errors.username}>
                                <Input
                                    value={data.username}
                                    onChange={e => setData('username', e.target.value)}
                                    placeholder="@username"
                                    error={errors.username}
                                    autoComplete="username"
                                />
                            </FormField>
                        </div>

                        {/* Title / Headline */}
                        <FormField label="Title / Headline" error={errors.title} hint="Contoh: Fullstack Developer">
                            <Input
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Profesi atau headline profil"
                                error={errors.title}
                            />
                        </FormField>

                        {/* Location + Work Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Lokasi" error={errors.location}>
                                <Input
                                    icon={MapPin}
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="Jakarta, Indonesia"
                                    error={errors.location}
                                />
                            </FormField>
                            <FormField label="Tipe Pekerjaan" error={errors.work_type}>
                                <Select
                                    value={data.work_type}
                                    onChange={e => setData('work_type', e.target.value)}
                                    options={WORK_TYPE_OPTIONS}
                                    placeholder="Pilih tipe"
                                    error={errors.work_type}
                                />
                            </FormField>
                        </div>

                        {/* Bio */}
                        <FormField label="Bio" error={errors.bio} hint="Maksimal 1000 karakter">
                            <TextArea
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                placeholder="Ceritakan sedikit tentang diri Anda..."
                                rows={4}
                                error={errors.bio}
                                maxLength={1000}
                            />
                        </FormField>

                        <div className="border-t border-white/[0.06]" />

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Email" error={errors.email}>
                                <Input
                                    icon={Mail}
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="email@contoh.com"
                                    error={errors.email}
                                    autoComplete="email"
                                />
                            </FormField>
                            <FormField label="WhatsApp" error={errors.whatsapp}>
                                <Input
                                    icon={Phone}
                                    value={data.whatsapp}
                                    onChange={e => setData('whatsapp', e.target.value)}
                                    placeholder="+62 812 3456 7890"
                                    error={errors.whatsapp}
                                />
                            </FormField>
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="GitHub" error={errors.github}>
                                <Input
                                    icon={Github}
                                    value={data.github}
                                    onChange={e => setData('github', e.target.value)}
                                    placeholder="https://github.com/username"
                                    error={errors.github}
                                />
                            </FormField>
                            <FormField label="LinkedIn" error={errors.linkedin}>
                                <Input
                                    icon={Linkedin}
                                    value={data.linkedin}
                                    onChange={e => setData('linkedin', e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                    error={errors.linkedin}
                                />
                            </FormField>
                            <FormField label="Instagram" error={errors.instagram}>
                                <Input
                                    icon={Instagram}
                                    value={data.instagram}
                                    onChange={e => setData('instagram', e.target.value)}
                                    placeholder="https://instagram.com/username"
                                    error={errors.instagram}
                                />
                            </FormField>
                            <FormField label="TikTok" error={errors.tiktok}>
                                <Input
                                    icon={Video}
                                    value={data.tiktok}
                                    onChange={e => setData('tiktok', e.target.value)}
                                    placeholder="https://tiktok.com/@username"
                                    error={errors.tiktok}
                                />
                            </FormField>
                        </div>

                        {/* Actions - SAME PATTERN as Achievements */}
                        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                            <Button 
                                type="submit" 
                                loading={processing} 
                                className="flex-1"
                                disabled={processing}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {recentlySuccessful ? 'Tersimpan!' : (isEdit ? 'Simpan Perubahan' : 'Simpan Profile')}
                            </Button>
                            <Link href="/admin/profile">
                                <Button type="button" variant="outline" disabled={processing}>
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}