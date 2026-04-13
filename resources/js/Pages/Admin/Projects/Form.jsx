// resources/js/Pages/Admin/Projects/Form.jsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Button, FormField, Input, TextArea,
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, ExternalLink, Github,
    CheckCircle2, Plus, Star, Hash,
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Quote, Code, Code2,
    Link2, ImageIcon, AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Heading3,
    Undo2, Redo2, Minus, Table,
    ChevronDown,
    // ── icons baru untuk gallery
    GripVertical, Pencil, Trash2, Images, Check, Loader2,
} from 'lucide-react';

// ─── TipTap imports ────────────────────────────────────────────────────────────
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import PlaceholderExt from '@tiptap/extension-placeholder';
import TextAlignExt from '@tiptap/extension-text-align';
import { Table as TableExt } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';

// Setup lowlight
const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('js', javascript);
lowlight.register('php', php);
lowlight.register('css', css);
lowlight.register('html', html);
lowlight.register('xml', html);
lowlight.register('python', python);
lowlight.register('bash', bash);
lowlight.register('json', json);
lowlight.register('sql', sql);

// ─── Helper: CSRF token ───────────────────────────────────────────────────────
function getCsrf() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

// ─── Thumbnail Uploader ────────────────────────────────────────────────────────
function ThumbnailUploader({ value, preview, onFileChange, onRemove, error }) {
    const inputRef  = useRef(null);
    const [drag, setDrag] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault(); setDrag(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) onFileChange(file);
    };

    const displaySrc = preview || value;

    return (
        <FormField label="Thumbnail" error={error} hint={<span className="normal-case font-normal">(opsional)</span>}>
            {displaySrc ? (
                <div className="relative w-full max-w-[320px] group">
                    <div className="rounded-xl overflow-hidden border border-white/[0.08] aspect-video bg-white/[0.03]">
                        <img src={displaySrc} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <button type="button" onClick={onRemove}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button type="button" onClick={() => inputRef.current?.click()}
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-[11px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-3 h-3" /> Ganti
                    </button>
                </div>
            ) : (
                <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop} onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3 w-full max-w-[320px] aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all ${drag ? 'border-indigo-500/60 bg-indigo-500/[0.06]' : 'border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]'}`}>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white/30" />
                    </div>
                    <div className="text-center">
                        <p className="text-[13px] text-white/50">Klik atau drag & drop</p>
                        <p className="text-[11px] text-white/25 mt-0.5">PNG, JPG, WEBP · maks. 3MB</p>
                    </div>
                </div>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files[0] && onFileChange(e.target.files[0])} />
        </FormField>
    );
}


// ─── TechStack Multi Select ───────────────────────────────────────────────────
function TechStackSelect({ value = [], onChange, skills = [] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSkills = skills.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) && 
        !value.includes(s.name)
    );

    const toggleSkill = (skillName) => {
        if (value.includes(skillName)) {
            onChange(value.filter(t => t !== skillName));
        } else {
            onChange([...value, skillName]);
        }
    };

    const removeSkill = (tech) => onChange(value.filter(t => t !== tech));

    return (
        <div ref={containerRef} className="relative">
            <div 
                className="flex flex-wrap gap-1.5 min-h-[42px] w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 cursor-text focus-within:border-indigo-500/50 transition-colors"
                onClick={() => setOpen(true)}
            >
                {value.map(tech => {
                    const skill = skills.find(s => s.name === tech);
                    return (
                        <span key={tech}
                            className="inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                            {skill?.icon_url && (
                                <img src={skill.icon_url} alt={tech} className="w-3 h-3 rounded" onError={e => e.target.style.display='none'} />
                            )}
                            {tech}
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeSkill(tech); }}
                                className="ml-0.5 opacity-60 hover:opacity-100">
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </span>
                    );
                })}
                <span className="text-[13px] text-white/40 flex-1">
                    {value.length === 0 ? 'Pilih teknologi...' : ''}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-white/[0.06]">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari skill..."
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredSkills.length === 0 ? (
                            <p className="px-3 py-2 text-[12px] text-white/30">
                                {search ? 'Tidak ditemukan' : 'Semua skill sudah dipilih'}
                            </p>
                        ) : (
                            filteredSkills.map(skill => (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => { toggleSkill(skill.name); setSearch(''); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[13px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                                >
                                    {skill.icon_url && (
                                        <img src={skill.icon_url} alt={skill.name} className="w-4 h-4 rounded" onError={e => e.target.style.display='none'} />
                                    )}
                                    <span>{skill.name}</span>
                                    {skill.color && (
                                        <span className="ml-auto w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: skill.color }} />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                    
                    <div className="px-3 py-2 bg-white/[0.02] border-t border-white/[0.06] text-[11px] text-white/30">
                        {value.length} dipilih • Klik untuk toggle
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Toolbar Button ────────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, active, disabled, title, children, className = '' }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} title={title}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-[11px] transition-all ${active ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.06]'} disabled:opacity-30 disabled:cursor-not-allowed ${className}`}>
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-white/[0.08] mx-0.5" />;
}

// ─── TipTap Editor ─────────────────────────────────────────────────────────────
function RichTextEditor({ value, onChange, error }) {
    const imageInputRef = useRef(null);
    const [uploading, setUploading]     = useState(false);
    const [linkDialog, setLinkDialog]   = useState(false);
    const [linkUrl, setLinkUrl]         = useState('');
    const [codeBlockLang, setCodeBlockLang] = useState('javascript');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                link: false,
                underline: false,
            }),
            UnderlineExt,
            LinkExt.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'tiptap-link',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            ImageExt.configure({
                HTMLAttributes: { class: 'tiptap-image' },
            }),
            PlaceholderExt.configure({
                placeholder: 'Tulis deskripsi project di sini...',
            }),
            TextAlignExt.configure({
                types: ['heading', 'paragraph'],
            }),
            TableExt.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: { class: 'tiptap-code-block' },
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor focus:outline-none min-h-[300px] prose-custom',
            },
        },
    });

    const handleImageUpload = async (file) => {
        if (!file || !editor) return;
        if (!file.type.startsWith('image/')) { alert('Hanya file gambar yang diperbolehkan'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Ukuran gambar maksimal 5MB'); return; }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('/admin/projects/upload-image', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': getCsrf(), 'Accept': 'application/json' },
                body: formData,
                credentials: 'same-origin',
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed: ${res.status}`);
            }

            const data = await res.json();
            if (data.url) {
                editor.chain().focus().setImage({ src: data.url, alt: file.name || 'Uploaded image', title: file.name }).run();
            } else {
                throw new Error('No URL returned from server');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            alert(`Gagal upload gambar: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const setLink = () => {
        if (!linkUrl) { editor.chain().focus().unsetLink().run(); }
        else { editor.chain().focus().setLink({ href: linkUrl }).run(); }
        setLinkDialog(false);
        setLinkUrl('');
    };

    const openLinkDialog = () => {
        setLinkUrl(editor.getAttributes('link').href || '');
        setLinkDialog(true);
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    if (!editor) return null;

    const LANGUAGES = ['javascript','php','css','html','python','bash','json','sql','typescript','vue','jsx','tsx'];

    return (
        <div className={`rounded-xl border overflow-hidden ${error ? 'border-red-500/50' : 'border-white/[0.08]'}`}>
            
            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-white/[0.02] border-b border-white/[0.06]">
                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarDivider />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
                    <Heading1 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
                    <Heading3 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarDivider />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <Underline className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                    <Strikethrough className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
                    <Code className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarDivider />
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    <AlignLeft className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
                    <AlignCenter className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
                    <AlignRight className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarDivider />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                    <List className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
                    <ListOrdered className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <Quote className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    <Minus className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarDivider />
                <div className="flex items-center gap-0.5">
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock({ language: codeBlockLang }).run()} active={editor.isActive('codeBlock')} title="Code Block">
                        <Code2 className="w-3.5 h-3.5" />
                    </ToolbarBtn>
                    <select
                        value={codeBlockLang}
                        onChange={e => {
                            setCodeBlockLang(e.target.value);
                            if (editor.isActive('codeBlock')) {
                                editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value }).run();
                            }
                        }}
                        className="h-7 bg-white/[0.04] border border-white/[0.08] rounded-md px-1.5 text-[10px] text-white/50 focus:outline-none appearance-none cursor-pointer"
                    >
                        {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#161616]">{l}</option>)}
                    </select>
                </div>
                <ToolbarDivider />
                <ToolbarBtn onClick={insertTable} active={editor.isActive('table')} title="Insert Table">
                    <Table className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarDivider />
                <ToolbarBtn onClick={openLinkDialog} active={editor.isActive('link')} title="Insert Link">
                    <Link2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => imageInputRef.current?.click()} disabled={uploading} title="Insert Image">
                    {uploading
                        ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        : <ImageIcon className="w-3.5 h-3.5" />
                    }
                </ToolbarBtn>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && handleImageUpload(e.target.files[0])} />
            </div>

            {/* ── Link Dialog ── */}
            {linkDialog && (
                <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/[0.06] border-b border-indigo-500/20">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <input
                        autoFocus type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setLinkDialog(false); }}
                        placeholder="https://..."
                        className="flex-1 bg-transparent text-[13px] text-white placeholder-white/25 focus:outline-none"
                    />
                    <button type="button" onClick={setLink}
                        className="text-[11.5px] text-indigo-300 hover:text-indigo-200 font-medium px-2 py-0.5 rounded bg-indigo-500/15">
                        {linkUrl ? 'Simpan' : 'Hapus Link'}
                    </button>
                    <button type="button" onClick={() => setLinkDialog(false)} className="text-white/30 hover:text-white/60">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* ── Table Context Menu ── */}
            {editor.isActive('table') && (
                <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 bg-white/[0.01] border-b border-white/[0.04]">
                    <span className="text-[10px] text-white/25 mr-1">Tabel:</span>
                    {[
                        { label: '+ Kolom Sebelum', fn: () => editor.chain().focus().addColumnBefore().run() },
                        { label: '+ Kolom Sesudah', fn: () => editor.chain().focus().addColumnAfter().run() },
                        { label: '- Kolom', fn: () => editor.chain().focus().deleteColumn().run() },
                        { label: '+ Baris Sebelum', fn: () => editor.chain().focus().addRowBefore().run() },
                        { label: '+ Baris Sesudah', fn: () => editor.chain().focus().addRowAfter().run() },
                        { label: '- Baris', fn: () => editor.chain().focus().deleteRow().run() },
                        { label: 'Hapus Tabel', fn: () => editor.chain().focus().deleteTable().run() },
                    ].map(({ label, fn }) => (
                        <button key={label} type="button" onClick={fn}
                            className="text-[10px] text-white/40 hover:text-white/70 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Editor Area ── */}
            <div className="bg-[#0d0d0d] px-4 py-3">
                <EditorContent editor={editor} />
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-2 bg-white/[0.01] border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[10.5px] text-white/20">
                    {editor.storage.characterCount?.characters?.() ?? 0} karakter
                    &nbsp;·&nbsp;
                    {editor.getText().trim().split(/\s+/).filter(Boolean).length} kata
                </span>
                <span className="text-[10.5px] text-white/15">TipTap Editor</span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ▼▼▼  KOMPONEN BARU: Portfolio Gallery  ▼▼▼
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PortfolioGallery — upload banyak gambar tak terbatas per project.
 *
 * Props:
 *   projectId  — ID project (null jika mode create, gallery dinonaktifkan)
 *   initialImages — array dari project.images (dari DB)
 */
function PortfolioGallery({ projectId, initialImages = [] }) {
    const [images, setImages]         = useState(initialImages);
    const [uploading, setUploading]   = useState(false);
    const [progress, setProgress]     = useState(0);       // 0-100
    const [dragOver, setDragOver]     = useState(false);
    const [editingId, setEditingId]   = useState(null);
    const [editCaption, setEditCaption] = useState('');
    const [lightbox, setLightbox]     = useState(null);    // index gambar yg di-preview
    const [dragItem, setDragItem]     = useState(null);    // untuk reorder
    const [deletingId, setDeletingId] = useState(null);
    const fileInputRef = useRef(null);

    // ── Upload multiple files ──────────────────────────────────────────────
    const handleFiles = async (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!valid.length) return;
        if (!projectId) { alert('Simpan project terlebih dahulu sebelum menambah gallery.'); return; }

        setUploading(true);
        setProgress(0);

        // Upload in batches of 5 to show incremental progress
        const BATCH = 5;
        let done = 0;
        const total = valid.length;
        const newImages = [];

        for (let i = 0; i < valid.length; i += BATCH) {
            const batch = valid.slice(i, i + BATCH);
            const fd = new FormData();
            batch.forEach(f => fd.append('images[]', f));

            try {
                const res = await fetch(`/admin/projects/${projectId}/images`, {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': getCsrf(), 'Accept': 'application/json' },
                    body: fd,
                    credentials: 'same-origin',
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                newImages.push(...(data.images || []));
            } catch (err) {
                console.error('Upload batch failed', err);
                alert(`Gagal upload sebagian gambar: ${err.message}`);
            }

            done += batch.length;
            setProgress(Math.round((done / total) * 100));
        }

        setImages(prev => [...prev, ...newImages]);
        setUploading(false);
        setProgress(0);
    };

    // ── Delete ─────────────────────────────────────────────────────────────
    const handleDelete = async (img) => {
        if (!confirm(`Hapus gambar ini?`)) return;
        setDeletingId(img.id);
        try {
            const res = await fetch(`/admin/projects/${projectId}/images/${img.id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': getCsrf(), 'Accept': 'application/json' },
                credentials: 'same-origin',
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setImages(prev => prev.filter(i => i.id !== img.id));
            if (lightbox !== null) setLightbox(null);
        } catch (err) {
            alert(`Gagal hapus: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    // ── Update caption ─────────────────────────────────────────────────────
    const saveCaption = async (img) => {
        try {
            const res = await fetch(`/admin/projects/${projectId}/images/${img.id}`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': getCsrf(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ caption: editCaption }),
                credentials: 'same-origin',
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setImages(prev => prev.map(i => i.id === img.id ? { ...i, caption: editCaption } : i));
        } catch (err) {
            alert(`Gagal simpan caption: ${err.message}`);
        } finally {
            setEditingId(null);
        }
    };

    // ── Drag-to-reorder ────────────────────────────────────────────────────
    const handleDragStart = (e, idx) => {
        setDragItem(idx);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (idx) => {
        if (dragItem === null || dragItem === idx) return;
        const reordered = [...images];
        const [moved] = reordered.splice(dragItem, 1);
        reordered.splice(idx, 0, moved);
        setDragItem(idx);
        setImages(reordered);
    };

    const handleDragEnd = async () => {
        setDragItem(null);
        // Kirim urutan baru ke server
        try {
            await fetch(`/admin/projects/${projectId}/images/reorder`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrf(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: images.map(i => i.id) }),
                credentials: 'same-origin',
            });
        } catch (err) {
            console.error('Reorder failed', err);
        }
    };

    // ── Disabled state (mode create) ───────────────────────────────────────
    if (!projectId) {
        return (
            <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] px-6 py-8 text-center">
                <Images className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-[13px] text-white/30">Portfolio Gallery</p>
                <p className="text-[11.5px] text-white/18 mt-1">
                    Simpan project terlebih dahulu, lalu tambah gambar gallery di halaman Edit.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-white/40" />
                    <span className="text-[13px] font-medium text-white/70">
                        Portfolio Gallery
                    </span>
                    <span className="text-[11px] text-white/25 bg-white/[0.05] px-2 py-0.5 rounded-full">
                        {images.length} gambar
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/20 text-[12px] text-indigo-300 transition-all disabled:opacity-50"
                >
                    {uploading
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Plus className="w-3.5 h-3.5" />
                    }
                    Tambah Foto
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => e.target.files?.length && handleFiles(e.target.files)}
                />
            </div>

            {/* ── Upload progress bar ── */}
            {uploading && (
                <div className="mb-3 rounded-full overflow-hidden bg-white/[0.06] h-1.5">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-200 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* ── Drop Zone / Grid ── */}
            <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFiles(e.dataTransfer.files);
                }}
                className={`rounded-xl border-2 border-dashed transition-all ${
                    dragOver
                        ? 'border-indigo-500/50 bg-indigo-500/[0.04]'
                        : images.length === 0
                            ? 'border-white/[0.08] hover:border-white/[0.12]'
                            : 'border-transparent'
                }`}
            >
                {images.length === 0 ? (
                    /* ── Empty state ── */
                    <div
                        className="flex flex-col items-center justify-center gap-3 py-12 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                            <Images className="w-6 h-6 text-white/20" />
                        </div>
                        <div className="text-center">
                            <p className="text-[13px] text-white/40">Drag & drop atau klik untuk upload</p>
                            <p className="text-[11px] text-white/20 mt-0.5">
                                PNG, JPG, WEBP, GIF · maks. 5MB per file · jumlah tak terbatas
                            </p>
                        </div>
                    </div>
                ) : (
                    /* ── Image Grid ── */
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-0.5">
                        {images.map((img, idx) => (
                            <div
                                key={img.id}
                                draggable
                                onDragStart={e => handleDragStart(e, idx)}
                                onDragEnter={() => handleDragEnter(idx)}
                                onDragEnd={handleDragEnd}
                                onDragOver={e => e.preventDefault()}
                                className={`group relative rounded-xl overflow-hidden aspect-square bg-white/[0.03] border transition-all cursor-grab active:cursor-grabbing select-none ${
                                    dragItem === idx
                                        ? 'border-indigo-500/60 scale-95 opacity-70'
                                        : 'border-white/[0.07] hover:border-white/[0.14]'
                                }`}
                            >
                                {/* Gambar */}
                                <img
                                    src={img.url}
                                    alt={img.caption || `Gallery ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    onClick={() => setLightbox(idx)}
                                />

                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                    {/* Top row */}
                                    <div className="flex items-center justify-between">
                                        {/* Drag handle */}
                                        <div className="w-5 h-5 flex items-center justify-center rounded bg-black/40">
                                            <GripVertical className="w-3 h-3 text-white/50" />
                                        </div>
                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(img)}
                                            disabled={deletingId === img.id}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                                        >
                                            {deletingId === img.id
                                                ? <Loader2 className="w-3 h-3 text-white animate-spin" />
                                                : <Trash2 className="w-3 h-3 text-white" />
                                            }
                                        </button>
                                    </div>

                                    {/* Bottom: preview + caption */}
                                    <div className="flex items-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setLightbox(idx)}
                                            className="flex-1 text-[10px] text-white/60 truncate text-left leading-tight"
                                        >
                                            {img.caption || <span className="italic text-white/30">Tambah caption...</span>}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setEditingId(img.id); setEditCaption(img.caption || ''); }}
                                            className="w-5 h-5 flex items-center justify-center rounded bg-black/40 hover:bg-black/70 flex-shrink-0"
                                        >
                                            <Pencil className="w-2.5 h-2.5 text-white/60" />
                                        </button>
                                    </div>
                                </div>

                                {/* Index badge */}
                                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center">
                                    <span className="text-[8px] text-white/60 font-mono">{idx + 1}</span>
                                </div>
                            </div>
                        ))}

                        {/* ── Add more tile ── */}
                        <div
                            className="aspect-square rounded-xl border-2 border-dashed border-white/[0.07] hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Plus className="w-5 h-5 text-white/20" />
                            <span className="text-[10px] text-white/20">Tambah</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Caption Edit Modal ── */}
            {editingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setEditingId(null)}>
                    <div
                        className="bg-[#161616] border border-white/[0.1] rounded-2xl p-5 w-full max-w-sm shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h4 className="text-[14px] font-semibold text-white mb-3">Edit Caption</h4>
                        <input
                            autoFocus
                            type="text"
                            value={editCaption}
                            onChange={e => setEditCaption(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') saveCaption(images.find(i => i.id === editingId));
                                if (e.key === 'Escape') setEditingId(null);
                            }}
                            placeholder="Caption gambar (opsional)"
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 mb-4"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => saveCaption(images.find(i => i.id === editingId))}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[13px] text-white transition-colors"
                            >
                                <Check className="w-3.5 h-3.5" /> Simpan
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[13px] text-white/60 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Lightbox ── */}
            {lightbox !== null && images[lightbox] && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative max-w-4xl w-full px-4" onClick={e => e.stopPropagation()}>
                        {/* Nav prev */}
                        {lightbox > 0 && (
                            <button
                                type="button"
                                onClick={() => setLightbox(l => l - 1)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white z-10 ml-1"
                            >
                                ‹
                            </button>
                        )}

                        <img
                            src={images[lightbox].url}
                            alt={images[lightbox].caption || ''}
                            className="w-full max-h-[80vh] object-contain rounded-xl border border-white/[0.08]"
                        />

                        {/* Caption */}
                        {images[lightbox].caption && (
                            <p className="text-center text-[12px] text-white/50 mt-2">
                                {images[lightbox].caption}
                            </p>
                        )}

                        {/* Counter */}
                        <p className="text-center text-[11px] text-white/25 mt-1">
                            {lightbox + 1} / {images.length}
                        </p>

                        {/* Nav next */}
                        {lightbox < images.length - 1 && (
                            <button
                                type="button"
                                onClick={() => setLightbox(l => l + 1)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white z-10 mr-1"
                            >
                                ›
                            </button>
                        )}

                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setLightbox(null)}
                            className="absolute top-2 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Delete from lightbox */}
                        <button
                            type="button"
                            onClick={() => handleDelete(images[lightbox])}
                            disabled={deletingId === images[lightbox].id}
                            className="absolute top-2 left-6 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-[11.5px] text-red-300 transition-colors"
                        >
                            <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                    </div>
                </div>
            )}

            {/* ── Hint ── */}
            {images.length > 0 && (
                <p className="mt-2 text-[11px] text-white/20">
                    Drag untuk mengubah urutan · Klik gambar untuk preview
                </p>
            )}
        </div>
    );
}
// ═══════════════════════════════════════════════════════════════════════════════
//  ▲▲▲  END PortfolioGallery  ▲▲▲
// ═══════════════════════════════════════════════════════════════════════════════


// ─── Main Form Page ─────────────────────────────────────────────────────────────
export default function Form({ project, mode, skills = [] }) {
    const isEdit = mode === 'edit';
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title:       project?.title       || '',
        description: project?.description || '',
        demo_url:    project?.demo_url    || '',
        repo_url:    project?.repo_url    || '',
        tech_stack:  project?.tech_stack  || [],
        is_featured: project?.is_featured ?? false,
        order:       project?.order       ?? '',
        thumbnail:   null,
    });

    const handleFileChange = (file) => {
        setData('thumbnail', file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            post(`/admin/projects/${project.id}?_method=PUT`, options);
        } else {
            post('/admin/projects', options);
        }
    };

    const thumbSrc = previewUrl || (isEdit ? project?.thumbnail : null);

    return (
        <AdminLayout title={isEdit ? 'Edit Project' : 'Tambah Project'}>
            {/* TipTap CSS — tidak diubah sama sekali */}
            <style>{`
                .tiptap-editor {
                    color: rgba(255,255,255,0.82);
                    font-size: 14px;
                    line-height: 1.75;
                    padding: 4px 0;
                }
                .tiptap-editor p { margin: 0 0 0.75em; }
                .tiptap-editor p:last-child { margin-bottom: 0; }
                .tiptap-editor h1 { font-size: 1.6em; font-weight: 700; color: rgba(255,255,255,0.92); margin: 1.2em 0 0.5em; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.3em; }
                .tiptap-editor h2 { font-size: 1.3em; font-weight: 700; color: rgba(255,255,255,0.88); margin: 1.1em 0 0.4em; }
                .tiptap-editor h3 { font-size: 1.1em; font-weight: 600; color: rgba(255,255,255,0.85); margin: 1em 0 0.4em; }
                .tiptap-editor strong { color: rgba(255,255,255,0.92); font-weight: 600; }
                .tiptap-editor em { font-style: italic; color: rgba(255,255,255,0.75); }
                .tiptap-editor s { color: rgba(255,255,255,0.4); }
                .tiptap-editor code:not(pre code) {
                    background: rgba(99,102,241,0.12); color: #a5b4fc; padding: 0.15em 0.45em;
                    border-radius: 5px; font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 0.88em; border: 1px solid rgba(99,102,241,0.15);
                }
                .tiptap-editor pre {
                    background: #0a0a0a; border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 10px; padding: 16px 20px; margin: 1em 0; overflow-x: auto; position: relative;
                }
                .tiptap-editor pre code {
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important; font-size: 13px !important;
                    background: none !important; padding: 0 !important; border: none !important;
                    color: #e4e4e7; line-height: 1.65;
                }
                .hljs-keyword   { color: #c792ea; }
                .hljs-string    { color: #c3e88d; }
                .hljs-comment   { color: #546e7a; font-style: italic; }
                .hljs-number    { color: #f78c6c; }
                .hljs-function  { color: #82aaff; }
                .hljs-title     { color: #82aaff; }
                .hljs-variable  { color: #f07178; }
                .hljs-attr      { color: #ffcb6b; }
                .hljs-built_in  { color: #80cbc4; }
                .hljs-type      { color: #ffcb6b; }
                .hljs-selector-tag { color: #ff5572; }
                .hljs-tag       { color: #f07178; }
                .hljs-name      { color: #ff5572; }
                .hljs-operator  { color: #89ddff; }
                .hljs-punctuation { color: #89ddff; }
                .hljs-params    { color: #f78c6c; }
                .hljs-literal   { color: #ff5572; }
                .tiptap-editor blockquote {
                    border-left: 3px solid rgba(99,102,241,0.5); padding: 0.5em 0 0.5em 1.25em;
                    margin: 1em 0; color: rgba(255,255,255,0.5); font-style: italic;
                    background: rgba(99,102,241,0.04); border-radius: 0 8px 8px 0;
                }
                .tiptap-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.75em 0; }
                .tiptap-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.75em 0; }
                .tiptap-editor li { margin: 0.2em 0; }
                .tiptap-editor li::marker { color: rgba(99,102,241,0.7); }
                .tiptap-editor hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 1.5em 0; }
                .tiptap-link { color: #818cf8; text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
                .tiptap-link:hover { color: #a5b4fc; }
                .tiptap-image { max-width: 100%; border-radius: 8px; margin: 0.75em 0; border: 1px solid rgba(255,255,255,0.08); }
                .tiptap-editor img.ProseMirror-selectednode { outline: 2px solid #6366f1; outline-offset: 2px; }
                .tiptap-editor table { border-collapse: collapse; margin: 1em 0; width: 100%; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
                .tiptap-editor td, .tiptap-editor th { border: 1px solid rgba(255,255,255,0.06); padding: 8px 12px; vertical-align: top; min-width: 80px; font-size: 13px; }
                .tiptap-editor th { background: rgba(255,255,255,0.04); font-weight: 600; color: rgba(255,255,255,0.7); text-align: left; }
                .tiptap-editor tr:hover td { background: rgba(255,255,255,0.01); }
                .tiptap-editor .selectedCell { background: rgba(99,102,241,0.1) !important; }
                .tiptap-editor .is-editor-empty:first-child::before {
                    content: attr(data-placeholder); float: left; color: rgba(255,255,255,0.2);
                    pointer-events: none; height: 0;
                }
            `}</style>

            <div className="max-w-3xl">
                <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Project' : 'Tambah Project Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Thumbnail */}
                        <ThumbnailUploader
                            value={thumbSrc} preview={previewUrl}
                            onFileChange={handleFileChange}
                            onRemove={() => { setData('thumbnail', null); setPreviewUrl(null); }}
                            error={errors.thumbnail}
                        />

                        <div className="border-t border-white/[0.06]" />

                        {/* Title */}
                        <FormField label="Judul Project" required error={errors.title}>
                            <Input value={data.title} onChange={e => setData('title', e.target.value)}
                                placeholder="Nama project" error={errors.title} />
                        </FormField>

                        {/* Description — TipTap */}
                        <FormField label="Deskripsi" error={errors.description}>
                            <RichTextEditor
                                value={data.description}
                                onChange={(html) => setData('description', html)}
                                error={errors.description}
                            />
                        </FormField>

                        <div className="border-t border-white/[0.06]" />

                        {/* Tech Stack */}
                        <FormField label="Tech Stack" error={errors.tech_stack} hint="pilih dari daftar skill">
                            <TechStackSelect 
                                value={data.tech_stack} 
                                onChange={v => setData('tech_stack', v)} 
                                skills={skills || []}
                            />
                        </FormField>

                        {/* URLs */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Demo URL" error={errors.demo_url} hint="opsional">
                                <Input icon={ExternalLink} type="url" value={data.demo_url}
                                    onChange={e => setData('demo_url', e.target.value)}
                                    placeholder="https://..." error={errors.demo_url} />
                            </FormField>
                            <FormField label="Repo URL" error={errors.repo_url} hint="opsional">
                                <Input icon={Github} type="url" value={data.repo_url}
                                    onChange={e => setData('repo_url', e.target.value)}
                                    placeholder="https://github.com/..." error={errors.repo_url} />
                            </FormField>
                        </div>

                        {/* Order + Featured */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Urutan Tampil" error={errors.order} hint="angka kecil = tampil duluan">
                                <Input type="number" min="0" value={data.order}
                                    onChange={e => setData('order', e.target.value)}
                                    placeholder="0" error={errors.order} />
                            </FormField>
                            <FormField label="Featured">
                                <button
                                    type="button"
                                    onClick={() => setData('is_featured', !data.is_featured)}
                                    className={`h-10 w-full flex items-center gap-3 px-4 rounded-lg border transition-all text-[13.5px] ${
                                        data.is_featured
                                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                                            : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:border-white/20'
                                    }`}
                                >
                                    <Star className={`w-4 h-4 ${data.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                    {data.is_featured ? 'Featured (Tampil Unggulan)' : 'Biasa'}
                                </button>
                            </FormField>
                        </div>

                        <div className="border-t border-white/[0.06]" />

                        {/* ▼▼▼ PORTFOLIO GALLERY — komponen baru ▼▼▼ */}
                        <FormField
                            label="Portfolio Gallery"
                            hint={isEdit ? 'upload tak terbatas, drag untuk reorder' : 'tersedia setelah project disimpan'}
                        >
                            <PortfolioGallery
                                projectId={isEdit ? project?.id : null}
                                initialImages={project?.images || []}
                            />
                        </FormField>
                        {/* ▲▲▲ END PORTFOLIO GALLERY ▲▲▲ */}

                        <div className="border-t border-white/[0.06]" />

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button type="submit" loading={processing} className="flex-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Project'}
                            </Button>
                            <Link href="/admin/projects">
                                <Button type="button" variant="outline">Batal</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}