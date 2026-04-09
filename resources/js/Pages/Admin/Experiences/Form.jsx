// resources/js/Pages/Admin/Experiences/Form.jsx

import { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, 
    FormField, 
    Input,
    Select,
    TextArea,
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, MapPin, Calendar, Briefcase, Building2,
    AlertCircle, CheckCircle2, Clock,
} from 'lucide-react';

// ─── Logo Uploader (Struktur persis seperti Education) ─────────────────────
function LogoUploader({ value, preview, onFileChange, onRemove, error }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) onFileChange(file);
    };

    const displaySrc = preview || value;

    return (
        <FormField 
            label="Logo Perusahaan" 
            error={error}
            hint={<span className="normal-case font-normal">(opsional)</span>}
        >
            {displaySrc ? (
                <div className="relative w-full max-w-[280px] group">
                    <div className="rounded-xl overflow-hidden border border-white/[0.08] aspect-video bg-white/[0.03] flex items-center justify-center">
                        <img src={displaySrc} alt="Logo" className="w-full h-full object-contain p-2" />
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3.5 h-3.5 text-white" />
                    </button>
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
                    className={`flex flex-col items-center justify-center gap-3 w-full max-w-[280px] aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                        dragging 
                            ? 'border-indigo-500/60 bg-indigo-500/[0.06]' 
                            : 'border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]'
                    }`}
                >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white/30" />
                    </div>
                    <div className="text-center">
                        <p className="text-[13px] text-white/50">Klik atau drag & drop</p>
                        <p className="text-[11px] text-white/25 mt-0.5">PNG, JPG, SVG, WEBP · maks. 2MB</p>
                    </div>
                </div>
            )}

            <input 
                ref={inputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={e => e.target.files[0] && onFileChange(e.target.files[0])} 
            />
        </FormField>
    );
}

// ─── Main Form Page ───────────────────────────────────────────────────────────
export default function Form({ experience, mode }) {
    const isEdit = mode === 'edit';
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        title:        experience?.title || '',
        company:      experience?.company || '',
        logo:         null,
        location:     experience?.location || '',
        start_date:   experience?.start_date || '',
        end_date:     experience?.end_date || '',
        duration:     experience?.duration || '',
        type:         experience?.type || '',
        work_mode:    experience?.work_mode || '',
        description:  experience?.description || '',
        order:        experience?.order || '',
    });

    const handleFileChange = (file) => {
        setData('logo', file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleRemoveLogo = () => {
        setData('logo', null);
        setPreviewUrl(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true, preserveScroll: true };
        
        if (isEdit) {
            post(`/admin/experiences/${experience.id}?_method=PUT`, options);
        } else {
            post('/admin/experiences', options);
        }
    };

    const logoSrc = previewUrl || (isEdit ? experience?.logo : null);

    // Options untuk select
    const TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote'];
    const MODE_OPTIONS = ['On-site', 'Hybrid', 'Remote'];

    return (
        <AdminLayout title={isEdit ? 'Edit Pengalaman' : 'Tambah Pengalaman'}>
            <div className="max-w-3xl">
                <Link href="/admin/experiences" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Logo */}
                        <LogoUploader
                            value={logoSrc}
                            preview={previewUrl}
                            onFileChange={handleFileChange}
                            onRemove={handleRemoveLogo}
                            error={errors.logo}
                        />

                        <div className="border-t border-white/[0.06]" />

                        {/* Title + Company */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Posisi / Jabatan" required error={errors.title}>
                                <Input
                                    icon={Briefcase}
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="Contoh: Senior Frontend Developer"
                                    error={errors.title}
                                />
                            </FormField>
                            <FormField label="Nama Perusahaan" required error={errors.company}>
                                <Input
                                    icon={Building2}
                                    value={data.company}
                                    onChange={e => setData('company', e.target.value)}
                                    placeholder="Contoh: PT. Teknologi Indonesia"
                                    error={errors.company}
                                />
                            </FormField>
                        </div>

                        {/* Type + Work Mode */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Tipe Pekerjaan" required error={errors.type}>
                                <Select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    options={TYPE_OPTIONS}
                                    placeholder="Pilih tipe"
                                    error={errors.type}
                                />
                            </FormField>
                            <FormField label="Mode Kerja" required error={errors.work_mode}>
                                <Select
                                    value={data.work_mode}
                                    onChange={e => setData('work_mode', e.target.value)}
                                    options={MODE_OPTIONS}
                                    placeholder="Pilih mode"
                                    error={errors.work_mode}
                                />
                            </FormField>
                        </div>

                        {/* Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Tanggal Mulai" required error={errors.start_date}>
                                <Input
                                    icon={Calendar}
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    placeholder="Contoh: Jan 2023"
                                    error={errors.start_date}
                                />
                            </FormField>
                            <FormField label="Tanggal Selesai" error={errors.end_date} hint="kosongkan jika masih bekerja">
                                <Input
                                    icon={Calendar}
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                    placeholder="Contoh: Des 2024"
                                    error={errors.end_date}
                                />
                            </FormField>
                        </div>

                        {/* Location + Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Lokasi" required error={errors.location}>
                                <Input
                                    icon={MapPin}
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="Contoh: Jakarta, Indonesia"
                                    error={errors.location}
                                />
                            </FormField>
                            <FormField label="Durasi" error={errors.duration} hint="opsional, contoh: 2 tahun 3 bulan">
                                <Input
                                    icon={Clock}
                                    value={data.duration}
                                    onChange={e => setData('duration', e.target.value)}
                                    placeholder="Contoh: 2 tahun"
                                    error={errors.duration}
                                />
                            </FormField>
                        </div>

                        {/* Order */}
                        <FormField label="Urutan Tampil" error={errors.order} hint="angka kecil = tampil atas">
                            <Input
                                type="number"
                                min="0"
                                value={data.order}
                                onChange={e => setData('order', e.target.value)}
                                placeholder="Contoh: 1"
                                error={errors.order}
                            />
                        </FormField>

                        {/* Description */}
                        <FormField label="Deskripsi & Pencapaian" error={errors.description} hint="opsional, maks 2000 karakter">
                            <TextArea
                                value={data.description}
                                onChange={e => setData('description', e.target.value.slice(0, 2000))}
                                placeholder="Jelaskan tanggung jawab, proyek, dan pencapaian Anda..."
                                error={errors.description}
                            />
                            <p className="text-[10px] text-white/25 text-right mt-1">
                                {data.description?.length || 0}/2000
                            </p>
                        </FormField>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                            <Button type="submit" loading={processing} className="flex-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Pengalaman'}
                            </Button>
                            <Link href="/admin/experiences">
                                <Button type="button" variant="outline">Batal</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}