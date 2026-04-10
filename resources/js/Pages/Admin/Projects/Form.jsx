// resources/js/Pages/Admin/Projects/Form.jsx
import { useState, useRef, useCallback } from 'react';
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

// Setup lowlight dengan bahasa yang umum dipakai
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

// ─── TechStack Input ───────────────────────────────────────────────────────────
function TechStackInput({ value = [], onChange }) {
    const [input, setInput] = useState('');

    const add = () => {
        const trimmed = input.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInput('');
    };

    const remove = (tech) => onChange(value.filter(t => t !== tech));

    const handleKey = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
        if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1]);
    };

    return (
        <div>
            <div className="flex flex-wrap gap-1.5 min-h-[42px] w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
                {value.map(tech => (
                    <span key={tech}
                        className="inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                        <Code2 className="w-2.5 h-2.5" />
                        {tech}
                        <button type="button" onClick={() => remove(tech)}
                            className="ml-0.5 opacity-60 hover:opacity-100">
                            <X className="w-2.5 h-2.5" />
                        </button>
                    </span>
                ))}
                <input
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey} onBlur={add}
                    placeholder={value.length === 0 ? 'Ketik lalu Enter (misal: React, Laravel...)' : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-[13px] text-white placeholder-white/20 focus:outline-none"
                />
            </div>
            <p className="text-[11px] text-white/25 mt-1">Tekan Enter atau koma untuk menambah. Backspace untuk hapus.</p>
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
                codeBlock: false,    // pakai CodeBlockLowlight
                link: false,         // kita daftarkan LinkExt sendiri
                underline: false,    // kita daftarkan UnderlineExt sendiri
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

    // Upload image ke server
    const handleImageUpload = async (file) => {
        if (!file || !editor) return;
        
        // Validasi file
        if (!file.type.startsWith('image/')) {
            alert('Hanya file gambar yang diperbolehkan');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('Ukuran gambar maksimal 5MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            // ✅ Ambil CSRF token dengan fallback
            const csrfToken = 
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                document.querySelector('meta[name="_token"]')?.getAttribute('content');

            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const res = await fetch('/admin/projects/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    // ❌ Jangan set 'Content-Type': 'application/json' untuk FormData!
                    // Browser akan otomatis set multipart/form-data dengan boundary
                },
                body: formData,
                credentials: 'same-origin', // ✅ Penting untuk cookie/session
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed: ${res.status}`);
            }

            const data = await res.json();
            
            if (data.url) {
                // ✅ Insert image ke editor dengan atribut tambahan
                editor.chain().focus().setImage({ 
                    src: data.url,
                    alt: file.name || 'Uploaded image',
                    title: file.name
                }).run();
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
        if (!linkUrl) {
            editor.chain().focus().unsetLink().run();
        } else {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
        setLinkDialog(false);
        setLinkUrl('');
    };

    const openLinkDialog = () => {
        const prev = editor.getAttributes('link').href || '';
        setLinkUrl(prev);
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
                
                {/* History */}
                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo2 className="w-3.5 h-3.5" />
                </ToolbarBtn>

                <ToolbarDivider />

                {/* Headings */}
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

                {/* Formatting */}
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

                {/* Alignment */}
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

                {/* Lists */}
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

                {/* Code Block dengan pilihan bahasa */}
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
                        title="Code Language"
                    >
                        {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#161616]">{l}</option>)}
                    </select>
                </div>

                <ToolbarDivider />

                {/* Table */}
                <ToolbarBtn onClick={insertTable} active={editor.isActive('table')} title="Insert Table">
                    <Table className="w-3.5 h-3.5" />
                </ToolbarBtn>

                <ToolbarDivider />

                {/* Link */}
                <ToolbarBtn onClick={openLinkDialog} active={editor.isActive('link')} title="Insert Link">
                    <Link2 className="w-3.5 h-3.5" />
                </ToolbarBtn>

                {/* Image Upload */}
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
                    <button type="button" onClick={() => setLinkDialog(false)}
                        className="text-white/30 hover:text-white/60">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* ── Table Context Menu (saat di dalam tabel) ── */}
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

            {/* ── Word count / char count ── */}
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

// ─── Main Form Page ─────────────────────────────────────────────────────────────
export default function Form({ project, mode }) {
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
            {/* TipTap CSS */}
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
                    background: rgba(99,102,241,0.12);
                    color: #a5b4fc;
                    padding: 0.15em 0.45em;
                    border-radius: 5px;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 0.88em;
                    border: 1px solid rgba(99,102,241,0.15);
                }

                .tiptap-editor pre {
                    background: #0a0a0a;
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 10px;
                    padding: 16px 20px;
                    margin: 1em 0;
                    overflow-x: auto;
                    position: relative;
                }
                .tiptap-editor pre code {
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 13px !important;
                    background: none !important;
                    padding: 0 !important;
                    border: none !important;
                    color: #e4e4e7;
                    line-height: 1.65;
                }

                /* Highlight.js - Dark theme tones */
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
                    border-left: 3px solid rgba(99,102,241,0.5);
                    padding: 0.5em 0 0.5em 1.25em;
                    margin: 1em 0;
                    color: rgba(255,255,255,0.5);
                    font-style: italic;
                    background: rgba(99,102,241,0.04);
                    border-radius: 0 8px 8px 0;
                }

                .tiptap-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.75em 0; }
                .tiptap-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.75em 0; }
                .tiptap-editor li { margin: 0.2em 0; }
                .tiptap-editor li::marker { color: rgba(99,102,241,0.7); }

                .tiptap-editor hr {
                    border: none;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    margin: 1.5em 0;
                }

                .tiptap-link {
                    color: #818cf8;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                    transition: color 0.15s;
                }
                .tiptap-link:hover { color: #a5b4fc; }

                .tiptap-image {
                    max-width: 100%;
                    border-radius: 8px;
                    margin: 0.75em 0;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .tiptap-editor img.ProseMirror-selectednode {
                    outline: 2px solid #6366f1;
                    outline-offset: 2px;
                }

                /* Tables */
                .tiptap-editor table {
                    border-collapse: collapse;
                    margin: 1em 0;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .tiptap-editor td, .tiptap-editor th {
                    border: 1px solid rgba(255,255,255,0.06);
                    padding: 8px 12px;
                    vertical-align: top;
                    min-width: 80px;
                    font-size: 13px;
                }
                .tiptap-editor th {
                    background: rgba(255,255,255,0.04);
                    font-weight: 600;
                    color: rgba(255,255,255,0.7);
                    text-align: left;
                }
                .tiptap-editor tr:hover td { background: rgba(255,255,255,0.01); }
                .tiptap-editor .selectedCell { background: rgba(99,102,241,0.1) !important; }

                /* Placeholder */
                .tiptap-editor .is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: rgba(255,255,255,0.2);
                    pointer-events: none;
                    height: 0;
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
                        <FormField label="Tech Stack" error={errors.tech_stack} hint="teknologi yang digunakan">
                            <TechStackInput value={data.tech_stack} onChange={v => setData('tech_stack', v)} />
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