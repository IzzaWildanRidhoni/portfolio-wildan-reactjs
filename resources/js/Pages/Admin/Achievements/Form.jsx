// resources/js/Pages/Admin/Achievements/Form.jsx

import { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, ImageOff, ExternalLink,
    AlertCircle, CheckCircle2,
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

function TextInput({ error, ...props }) {
    return (
        <input
            className={`w-full h-10 bg-white/[0.04] border rounded-lg px-4 text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${
                error
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'
            }`}
            {...props}
        />
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

// ─── Thumbnail Uploader ────────────────────────────────────────────────────────

function ThumbnailUploader({ value, preview, onFileChange, onRemove, error }) {
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
                Thumbnail <span className="text-white/25 normal-case font-normal">(opsional)</span>
            </label>

            {displaySrc ? (
                <div className="relative w-full max-w-[280px] group">
                    <div className="rounded-xl overflow-hidden border border-white/[0.08] aspect-video bg-white/[0.03]">
                        <img src={displaySrc} alt="Thumbnail" className="w-full h-full object-cover" />
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
                        <p className="text-[11px] text-white/25 mt-0.5">PNG, JPG, WEBP · maks. 2MB</p>
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

export default function Form({ achievement, mode }) {
    const isEdit = mode === 'edit';
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title:          achievement?.title || '',
        issuer:         achievement?.issuer || '',
        credential_id:  achievement?.credential_id || '',
        issued_date:    achievement?.issued_date || '',
        type:           achievement?.type || '',
        category:       achievement?.category || '',
        credential_url: achievement?.credential_url || '',
        thumbnail:      null, // file only for new upload
    });

    const handleFileChange = (file) => {
        setData('thumbnail', file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleRemoveThumbnail = () => {
        setData('thumbnail', null);
        setPreviewUrl(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
        };

        if (isEdit) {
            // Use POST with _method spoofing for file upload + PUT
            post(`/admin/achievements/${achievement.id}?_method=PUT`, options);
        } else {
            post('/admin/achievements', options);
        }
    };

    // Thumbnail display: new preview > existing db thumb
    const thumbSrc = previewUrl || (isEdit ? achievement?.thumbnail : null);

    return (
        <AdminLayout title={isEdit ? 'Edit Achievement' : 'Tambah Achievement'}>
            <div className="max-w-2xl">
                {/* Back */}
                <Link href="/admin/achievements" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                {/* Card */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Achievement' : 'Tambah Achievement Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Thumbnail */}
                        <ThumbnailUploader
                            value={thumbSrc}
                            preview={previewUrl}
                            onFileChange={handleFileChange}
                            onRemove={handleRemoveThumbnail}
                            error={errors.thumbnail}
                        />

                        <div className="border-t border-white/[0.06]" />

                        {/* Title */}
                        <Field label="Judul" required error={errors.title}>
                            <TextInput
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Nama sertifikat / lencana"
                                error={errors.title}
                            />
                        </Field>

                        {/* Issuer */}
                        <Field label="Penerbit" required error={errors.issuer}>
                            <TextInput
                                value={data.issuer}
                                onChange={e => setData('issuer', e.target.value)}
                                placeholder="Contoh: Dicoding, AWS, Google"
                                error={errors.issuer}
                            />
                        </Field>

                        {/* Type + Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Type" required error={errors.type}>
                                <SelectInput
                                    value={data.type}
                                    onChange={v => setData('type', v)}
                                    options={['Profesional', 'Course', 'Certificate', 'Badge']}
                                    placeholder="Pilih type"
                                    error={errors.type}
                                />
                            </Field>
                            <Field label="Kategori" required error={errors.category}>
                                <SelectInput
                                    value={data.category}
                                    onChange={v => setData('category', v)}
                                    options={['Backend', 'Frontend', 'Mobile', 'DevOps', 'Design', 'Freelance']}
                                    placeholder="Pilih kategori"
                                    error={errors.category}
                                />
                            </Field>
                        </div>

                        {/* Issued Date + Credential ID */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Tanggal Terbit" required error={errors.issued_date} hint="Contoh: Jan 2024">
                                <TextInput
                                    value={data.issued_date}
                                    onChange={e => setData('issued_date', e.target.value)}
                                    placeholder="Jan 2024"
                                    error={errors.issued_date}
                                />
                            </Field>
                            <Field label="Credential ID" error={errors.credential_id}>
                                <TextInput
                                    value={data.credential_id}
                                    onChange={e => setData('credential_id', e.target.value)}
                                    placeholder="ID (opsional)"
                                    error={errors.credential_id}
                                />
                            </Field>
                        </div>

                        {/* Credential URL */}
                        <Field label="URL Verifikasi" error={errors.credential_url} hint="opsional">
                            <div className="relative">
                                <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                                <input
                                    type="url"
                                    value={data.credential_url}
                                    onChange={e => setData('credential_url', e.target.value)}
                                    placeholder="https://..."
                                    className={`w-full h-10 bg-white/[0.04] border rounded-lg pl-10 pr-4 text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${
                                        errors.credential_url
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-white/[0.08] focus:border-indigo-500/50'
                                    }`}
                                />
                            </div>
                        </Field>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                            <Button type="submit" loading={processing} className="flex-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Achievement'}
                            </Button>
                            <Link href="/admin/achievements">
                                <Button type="button" variant="outline">
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