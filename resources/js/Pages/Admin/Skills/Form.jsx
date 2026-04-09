// resources/js/Pages/Admin/Skills/Form.jsx
import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, 
    FormField, 
    Input,
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Type, Palette, Hash, CheckCircle2, Upload, X,
} from 'lucide-react';

// ─── Icon Preview ─────────────────────────────────────────────────────────────
function IconPreview({ value, onClear }) {
    if (!value) return null;
    return (
        <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-xl mt-2">
            <img src={value} alt="Icon preview" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <button type="button" onClick={onClear} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors">
                <X className="w-3 h-3 text-red-400" />
            </button>
        </div>
    );
}

// ─── Main Form Page ───────────────────────────────────────────────────────────
export default function Form({ skill, mode }) {
    const isEdit = mode === 'edit';
    const { data, setData, post, processing, errors } = useForm({
        name:     skill?.name || '',
        icon_url: skill?.icon_url || '',
        color:    skill?.color || '',
        order:    skill?.order ?? 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true };
        
        if (isEdit) {
            post(`/admin/skills/${skill.id}?_method=PUT`, options);
        } else {
            post('/admin/skills', options);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Skill' : 'Tambah Skill'}>
            <div className="max-w-3xl">
                <Link href="/admin/skills" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name */}
                        <FormField label="Nama Skill" required error={errors.name}>
                            <Input
                                icon={Type}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: JavaScript, Laravel, Figma"
                                error={errors.name}
                            />
                        </FormField>

                        <div className="border-t border-white/[0.06]" />

                        {/* Icon URL + Color */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="URL Icon" error={errors.icon_url} hint="opsional, link gambar langsung">
                                <Input
                                    icon={Upload}
                                    value={data.icon_url}
                                    onChange={e => setData('icon_url', e.target.value)}
                                    placeholder="https://cdn.example.com/js.svg"
                                    error={errors.icon_url}
                                />
                            </FormField>

                            <FormField label="Warna Aksen" error={errors.color} hint="format HEX">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            icon={Palette}
                                            value={data.color}
                                            onChange={e => setData('color', e.target.value.toUpperCase())}
                                            placeholder="#3B82F6"
                                            error={errors.color}
                                            className="pl-10"
                                        />
                                    </div>
                                    <input
                                        type="color"
                                        value={data.color || '#000000'}
                                        onChange={e => setData('color', e.target.value.toUpperCase())}
                                        className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-white/10 p-1"
                                    />
                                </div>
                            </FormField>
                        </div>

                        {/* Order */}
                        <FormField label="Urutan Tampil" error={errors.order} hint="angka kecil = tampil atas">
                            <Input
                                icon={Hash}
                                type="number"
                                min="0"
                                value={data.order}
                                onChange={e => setData('order', e.target.value === '' ? null : parseInt(e.target.value))}
                                placeholder="Contoh: 1"
                                error={errors.order}
                            />
                        </FormField>

                        {/* Icon Preview */}
                        <IconPreview value={data.icon_url} onClear={() => setData('icon_url', '')} />

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                            <Button type="submit" loading={processing} className="flex-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Skill'}
                            </Button>
                            <Link href="/admin/skills">
                                <Button type="button" variant="outline">Batal</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}