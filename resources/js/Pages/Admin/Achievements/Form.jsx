// resources/js/Pages/Admin/Achievements/Form.jsx

import { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, 
    FormField, 
    Input,      // Gunakan Input dari UI.jsx (sudah support label & error)
    Select,     // Komponen baru dari UI.jsx
    TextArea,   // Opsional, untuk future use
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, ExternalLink,
    AlertCircle, CheckCircle2,
} from 'lucide-react';

// ─── Thumbnail Uploader (Tetap lokal karena spesifik) ─────────────────────────

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
        <FormField 
            label="Thumbnail" 
            error={error}
            hint={<span className="normal-case font-normal">(opsional)</span>}
        >
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
        </FormField>
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
        thumbnail:      null,
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
        const options = { forceFormData: true, preserveScroll: true };

        if (isEdit) {
            post(`/admin/achievements/${achievement.id}?_method=PUT`, options);
        } else {
            post('/admin/achievements', options);
        }
    };

    const thumbSrc = previewUrl || (isEdit ? achievement?.thumbnail : null);

    // Options untuk select (bisa dipindah ke config terpisah jika sering dipakai)
    const TYPE_OPTIONS = ['Profesional', 'Course', 'Certificate', 'Badge'];
    const CATEGORY_OPTIONS = ['Backend', 'Frontend', 'Mobile', 'DevOps', 'Design', 'Freelance'];

    return (
        <AdminLayout title={isEdit ? 'Edit Achievement' : 'Tambah Achievement'}>
            <div className="max-w-2xl">
                <Link href="/admin/achievements" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

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

                        {/* Title - Gunakan Input dari UI.jsx */}
                        <FormField label="Judul" required error={errors.title}>
                            <Input
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Nama sertifikat / lencana"
                                error={errors.title}
                            />
                        </FormField>

                        {/* Issuer */}
                        <FormField label="Penerbit" required error={errors.issuer}>
                            <Input
                                value={data.issuer}
                                onChange={e => setData('issuer', e.target.value)}
                                placeholder="Contoh: Dicoding, AWS, Google"
                                error={errors.issuer}
                            />
                        </FormField>

                        {/* Type + Category - Gunakan Select dari UI.jsx */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Type" required error={errors.type}>
                                <Select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    options={TYPE_OPTIONS}
                                    placeholder="Pilih type"
                                    error={errors.type}
                                />
                            </FormField>
                            <FormField label="Kategori" required error={errors.category}>
                                <Select
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    options={CATEGORY_OPTIONS}
                                    placeholder="Pilih kategori"
                                    error={errors.category}
                                />
                            </FormField>
                        </div>

                        {/* Issued Date + Credential ID */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Tanggal Terbit" required error={errors.issued_date} hint="Contoh: Jan 2024">
                                <Input
                                    value={data.issued_date}
                                    onChange={e => setData('issued_date', e.target.value)}
                                    placeholder="Jan 2024"
                                    error={errors.issued_date}
                                />
                            </FormField>
                            <FormField label="Credential ID" error={errors.credential_id}>
                                <Input
                                    value={data.credential_id}
                                    onChange={e => setData('credential_id', e.target.value)}
                                    placeholder="ID (opsional)"
                                    error={errors.credential_id}
                                />
                            </FormField>
                        </div>

                        {/* Credential URL */}
                        <FormField label="URL Verifikasi" error={errors.credential_url} hint="opsional">
                            <Input
                                icon={ExternalLink}
                                type="url"
                                value={data.credential_url}
                                onChange={e => setData('credential_url', e.target.value)}
                                placeholder="https://..."
                                error={errors.credential_url}
                            />
                        </FormField>

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