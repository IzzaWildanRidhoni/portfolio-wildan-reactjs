// resources/js/Pages/Admin/Educations/Form.jsx

import { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, 
    FormField, 
    Input,      // Dari UI.jsx (sudah support icon, label, error)
    Select,     // Komponen baru dari UI.jsx
    TextArea,   // Komponen baru dari UI.jsx
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, MapPin, Calendar, GraduationCap,
    AlertCircle, CheckCircle2,
} from 'lucide-react';

// ─── Logo Uploader (Tetap lokal karena spesifik untuk education) ─────────────

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
            label="Logo Institusi" 
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

export default function Form({ education, mode }) {
    const isEdit = mode === 'edit';
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        institution:  education?.institution || '',
        logo:         null,
        degree:       education?.degree || '',
        field:        education?.field || '',
        gpa:          education?.gpa || '',
        start_year:   education?.start_year || '',
        end_year:     education?.end_year || '',
        location:     education?.location || '',
        level:        education?.level || '',
        description:  education?.description || '',
        order:        education?.order || '',
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
            post(`/admin/educations/${education.id}?_method=PUT`, options);
        } else {
            post('/admin/educations', options);
        }
    };

    const logoSrc = previewUrl || (isEdit ? education?.logo : null);

    // Options untuk select (bisa dipindah ke config terpisah jika sering dipakai)
    const LEVEL_OPTIONS = ['SMA', 'SMK', 'D3', 'S1', 'S2', 'S3', 'Professional', 'Certification'];

    return (
        <AdminLayout title={isEdit ? 'Edit Pendidikan' : 'Tambah Pendidikan'}>
            <div className="max-w-3xl">
                <Link href="/admin/educations" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Pendidikan' : 'Tambah Pendidikan Baru'}
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

                        {/* Institution - Gunakan Input dari UI.jsx dengan icon */}
                        <FormField label="Nama Institusi" required error={errors.institution}>
                            <Input
                                icon={GraduationCap}
                                value={data.institution}
                                onChange={e => setData('institution', e.target.value)}
                                placeholder="Contoh: Universitas Indonesia"
                                error={errors.institution}
                            />
                        </FormField>

                        {/* Degree + Field */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Gelar / Jenjang" required error={errors.degree}>
                                <Input
                                    value={data.degree}
                                    onChange={e => setData('degree', e.target.value)}
                                    placeholder="Contoh: Sarjana Komputer"
                                    error={errors.degree}
                                />
                            </FormField>
                            <FormField label="Jurusan / Bidang" required error={errors.field}>
                                <Input
                                    value={data.field}
                                    onChange={e => setData('field', e.target.value)}
                                    placeholder="Contoh: Teknik Informatika"
                                    error={errors.field}
                                />
                            </FormField>
                        </div>

                        {/* Level + GPA */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Level Pendidikan" required error={errors.level}>
                                <Select
                                    value={data.level}
                                    onChange={e => setData('level', e.target.value)}
                                    options={LEVEL_OPTIONS}
                                    placeholder="Pilih level"
                                    error={errors.level}
                                />
                            </FormField>
                            <FormField label="IPK / Nilai" error={errors.gpa} hint="opsional">
                                <Input
                                    value={data.gpa}
                                    onChange={e => setData('gpa', e.target.value)}
                                    placeholder="Contoh: 3.85/4.00"
                                    error={errors.gpa}
                                />
                            </FormField>
                        </div>

                        {/* Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Tahun Mulai" required error={errors.start_year}>
                                <Input
                                    icon={Calendar}
                                    value={data.start_year}
                                    onChange={e => setData('start_year', e.target.value)}
                                    placeholder="Contoh: 2020"
                                    error={errors.start_year}
                                />
                            </FormField>
                            <FormField label="Tahun Lulus" error={errors.end_year} hint="kosongkan jika masih berjalan">
                                <Input
                                    icon={Calendar}
                                    value={data.end_year}
                                    onChange={e => setData('end_year', e.target.value)}
                                    placeholder="Contoh: 2024"
                                    error={errors.end_year}
                                />
                            </FormField>
                        </div>

                        {/* Location + Order */}
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
                        </div>

                        {/* Description - Gunakan TextArea dari UI.jsx */}
                        <FormField label="Deskripsi" error={errors.description} hint="opsional, maks 1000 karakter">
                            <TextArea
                                value={data.description}
                                onChange={e => setData('description', e.target.value.slice(0, 1000))}
                                placeholder="Ceritakan pencapaian atau fokus studi Anda..."
                                error={errors.description}
                            />
                            <p className="text-[10px] text-white/25 text-right mt-1">
                                {data.description?.length || 0}/1000
                            </p>
                        </FormField>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                            <Button type="submit" loading={processing} className="flex-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Pendidikan'}
                            </Button>
                            <Link href="/admin/educations">
                                <Button type="button" variant="outline">Batal</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}