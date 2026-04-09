import { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, ImageOff, MapPin,
    AlertCircle, CheckCircle2, Calendar, GraduationCap,
} from 'lucide-react';

// ─── Field Wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, required, hint, children }) {
    return (
        <div>
            <div className="flex items-baseline justify-between mb-1.5">
                <label className="block text-[11.5px] text-white/50 font-medium uppercase tracking-wider">
                    {label}
                    {required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {hint && <span className="text-[11px] text-white/25">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Text Input ────────────────────────────────────────────────────────────────
function TextInput({ error, icon: Icon, ...props }) {
    return (
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
            )}
            <input
                className={`w-full h-10 bg-white/[0.04] border rounded-lg text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${
                    Icon ? 'pl-10 pr-4' : 'px-4'
                } ${
                    error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'
                }`}
                {...props}
            />
        </div>
    );
}

// ─── Select Input ──────────────────────────────────────────────────────────────
function SelectInput({ error, options, placeholder, value, onChange }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full h-10 bg-white/[0.04] border rounded-lg px-4 text-[13.5px] text-white focus:outline-none transition-all appearance-none cursor-pointer ${
                error
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-indigo-500/50'
            } ${!value ? 'text-white/30' : ''}`}
        >
            <option value="" className="bg-[#161616] text-white/50">{placeholder}</option>
            {options.map(o => (
                <option key={o} value={o} className="bg-[#161616] text-white">{o}</option>
            ))}
        </select>
    );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
function Textarea({ error, ...props }) {
    return (
        <textarea
            className={`w-full min-h-[80px] bg-white/[0.04] border rounded-lg px-4 py-3 text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all resize-none ${
                error
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'
            }`}
            {...props}
        />
    );
}

// ─── Logo Uploader ─────────────────────────────────────────────────────────────
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
        <div>
            <label className="block text-[11.5px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">
                Logo Institusi <span className="text-white/25 normal-case font-normal">(opsional)</span>
            </label>

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
                        dragging ? 'border-indigo-500/60 bg-indigo-500/[0.06]' : 'border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]'
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

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && onFileChange(e.target.files[0])} />
            {error && (
                <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
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

                        {/* Institution */}
                        <Field label="Nama Institusi" required error={errors.institution}>
                            <TextInput
                                icon={GraduationCap}
                                value={data.institution}
                                onChange={e => setData('institution', e.target.value)}
                                placeholder="Contoh: Universitas Indonesia"
                                error={errors.institution}
                            />
                        </Field>

                        {/* Degree + Field */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Gelar / Jenjang" required error={errors.degree}>
                                <TextInput
                                    value={data.degree}
                                    onChange={e => setData('degree', e.target.value)}
                                    placeholder="Contoh: Sarjana Komputer"
                                    error={errors.degree}
                                />
                            </Field>
                            <Field label="Jurusan / Bidang" required error={errors.field}>
                                <TextInput
                                    value={data.field}
                                    onChange={e => setData('field', e.target.value)}
                                    placeholder="Contoh: Teknik Informatika"
                                    error={errors.field}
                                />
                            </Field>
                        </div>

                        {/* Level + GPA */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Level Pendidikan" required error={errors.level}>
                                <SelectInput
                                    value={data.level}
                                    onChange={v => setData('level', v)}
                                    options={['SMA', 'SMK', 'D3', 'S1', 'S2', 'S3', 'Professional', 'Certification']}
                                    placeholder="Pilih level"
                                    error={errors.level}
                                />
                            </Field>
                            <Field label="IPK / Nilai" error={errors.gpa} hint="opsional">
                                <TextInput
                                    value={data.gpa}
                                    onChange={e => setData('gpa', e.target.value)}
                                    placeholder="Contoh: 3.85/4.00"
                                    error={errors.gpa}
                                />
                            </Field>
                        </div>

                        {/* Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Tahun Mulai" required error={errors.start_year}>
                                <TextInput
                                    icon={Calendar}
                                    value={data.start_year}
                                    onChange={e => setData('start_year', e.target.value)}
                                    placeholder="Contoh: 2020"
                                    error={errors.start_year}
                                />
                            </Field>
                            <Field label="Tahun Lulus" error={errors.end_year} hint="kosongkan jika masih berjalan">
                                <TextInput
                                    icon={Calendar}
                                    value={data.end_year}
                                    onChange={e => setData('end_year', e.target.value)}
                                    placeholder="Contoh: 2024"
                                    error={errors.end_year}
                                />
                            </Field>
                        </div>

                        {/* Location + Order */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Lokasi" required error={errors.location}>
                                <TextInput
                                    icon={MapPin}
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="Contoh: Jakarta, Indonesia"
                                    error={errors.location}
                                />
                            </Field>
                            <Field label="Urutan Tampil" error={errors.order} hint="angka kecil = tampil atas">
                                <TextInput
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={e => setData('order', e.target.value)}
                                    placeholder="Contoh: 1"
                                    error={errors.order}
                                />
                            </Field>
                        </div>

                        {/* Description */}
                        <Field label="Deskripsi" error={errors.description} hint="opsional, maks 1000 karakter">
                            <Textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value.slice(0, 1000))}
                                placeholder="Ceritakan pencapaian atau fokus studi Anda..."
                                error={errors.description}
                            />
                            <p className="text-[10px] text-white/25 text-right mt-1">{data.description?.length || 0}/1000</p>
                        </Field>

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