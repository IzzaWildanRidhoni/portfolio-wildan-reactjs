// resources/js/Pages/Admin/Blogs/Form.jsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Button, FormField, Input, TextArea,
} from '@/Components/Admin/UI';
import {
    ArrowLeft, Upload, X, ExternalLink, Globe,
    CheckCircle2, Plus, Star, Hash, Tag as TagIcon,
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Quote, Code, Code2,
    Link2, ImageIcon, AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Heading3,
    Undo2, Redo2, Minus, Table, Calendar, Eye,
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

// ─── Thumbnail Uploader (SAMA PERSIS seperti Projects) ───────────────────────
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

// ─── Tags Input (Menggantikan TechStackSelect) ───────────────────────────────
function TagsInput({ value = [], onChange, placeholder = 'Tambah tags...' }) {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = input.trim().toLowerCase();
            if (tag && !value.includes(tag) && value.length < 10) {
                onChange([...value, tag]);
                setInput('');
            }
        }
        if (e.key === 'Backspace' && !input && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(value.filter(t => t !== tagToRemove));
    };

    return (
        <div 
            className="flex flex-wrap gap-2 min-h-[42px] w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 cursor-text focus-within:border-indigo-500/50 transition-colors"
            onClick={() => inputRef.current?.focus()}
        >
            {value.map(tag => (
                <span key={tag}
                    className="inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    <TagIcon className="w-2.5 h-2.5 opacity-70" />
                    {tag}
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                        className="ml-0.5 opacity-60 hover:opacity-100">
                        <X className="w-2.5 h-2.5" />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/30 focus:outline-none min-w-[100px]"
            />
        </div>
    );
}

// ─── Toolbar Button (SAMA PERSIS) ────────────────────────────────────────────
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

// ─── TipTap Editor (SAMA, hanya ganti upload URL) ────────────────────────────
function RichTextEditor({ value, onChange, error, uploadUrl = '/admin/blogs/upload-image' }) {
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
                placeholder: 'Tulis konten artikel blog di sini...',
            }),
            TextAlignExt.configure({ types: ['heading', 'paragraph'] }),
            TableExt.configure({ resizable: true }),
            TableRow, TableHeader, TableCell,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: { class: 'tiptap-code-block' },
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'tiptap-editor focus:outline-none min-h-[300px] prose-custom',
            },
        },
    });

    const handleImageUpload = async (file) => {
        if (!file || !editor) return;
        if (!file.type.startsWith('image/')) {
            alert('Hanya file gambar yang diperbolehkan');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 5MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const csrfToken = 
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                document.querySelector('meta[name="_token"]')?.getAttribute('content');

            if (!csrfToken) throw new Error('CSRF token not found');

            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
                credentials: 'same-origin',
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed: ${res.status}`);
            }

            const data = await res.json();
            if (data.url) {
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
                        title="Code Language"
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
                    <button type="button" onClick={() => setLinkDialog(false)}
                        className="text-white/30 hover:text-white/60">
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

            {/* ── Word count ── */}
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

// ─── Creatable Category Select ───────────────────────────────────────────────
function CategorySelect({ value, onChange, error }) {
    const [categories, setCategories]   = useState([]);
    const [inputValue, setInputValue]   = useState('');
    const [isOpen, setIsOpen]           = useState(false);
    const [isCreating, setIsCreating]   = useState(false);
    const [loading, setLoading]         = useState(true);
    const containerRef                  = useRef(null);
    const inputRef                      = useRef(null);

    // Fetch kategori dari server
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/admin/blog-categories', {
                headers: { 'Accept': 'application/json' },
                credentials: 'same-origin',
            });
            const data = await res.json();
            setCategories(data);
        } catch (e) {
            console.error('Failed to fetch categories', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // Tutup dropdown saat klik luar
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setInputValue('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = categories.find(c => String(c.id) === String(value));

    const filtered = inputValue.trim()
        ? categories.filter(c => c.name.toLowerCase().includes(inputValue.toLowerCase()))
        : categories;

    const canCreate = inputValue.trim().length > 0 &&
        !categories.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

    const getCsrf = () =>
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const handleCreate = async () => {
        const name = inputValue.trim();
        if (!name || isCreating) return;
        setIsCreating(true);
        try {
            const res = await fetch('/admin/blog-categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrf(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ name, color: pendingColor }),
            });
            const newCat = await res.json();
            setCategories(prev => [...prev, newCat]);
            onChange(newCat.id);
            setIsOpen(false);
            setInputValue('');
        } catch (e) {
            console.error('Failed to create category', e);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSelect = (cat) => {
        onChange(cat.id);
        setIsOpen(false);
        setInputValue('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (canCreate) handleCreate();
            else if (filtered.length > 0) handleSelect(filtered[0]);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
            setInputValue('');
        }
    };

    // Warna-warna pilihan saat create
    const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];
    const [pendingColor, setPendingColor] = useState('#6366f1');

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger */}
            <div
                onClick={() => { setIsOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
                className={`flex items-center gap-2 w-full min-h-[40px] bg-white/[0.04] border rounded-lg px-3 py-1.5 cursor-pointer transition-colors ${
                    error ? 'border-red-500/50' : isOpen ? 'border-indigo-500/50' : 'border-white/[0.08] hover:border-white/[0.16]'
                }`}
            >
                {/* Badge selected */}
                {selected ? (
                    <span className="flex items-center gap-1.5 text-[12px] px-2 py-0.5 rounded-md border"
                        style={{
                            background: selected.color + '20',
                            borderColor: selected.color + '40',
                            color: selected.color,
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: selected.color }} />
                        {selected.name}
                    </span>
                ) : (
                    <span className="text-[13px] text-white/25 flex-1">Pilih atau buat kategori...</span>
                )}

                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                    {selected && (
                        <button type="button" onClick={handleClear}
                            className="w-4 h-4 flex items-center justify-center text-white/25 hover:text-white/60 transition-colors rounded">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-white/25 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1.5 w-full bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
                    {/* Search input */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
                        <Hash className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Cari atau ketik nama baru..."
                            className="flex-1 bg-transparent text-[13px] text-white placeholder-white/25 focus:outline-none"
                        />
                        {inputValue && (
                            <button type="button" onClick={() => setInputValue('')}
                                className="text-white/25 hover:text-white/50">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[200px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {filtered.length === 0 && !canCreate && (
                                    <p className="text-center text-[12px] text-white/25 py-5">Tidak ada kategori</p>
                                )}
                                {filtered.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleSelect(cat)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/[0.04] ${
                                            String(value) === String(cat.id) ? 'bg-indigo-500/[0.08]' : ''
                                        }`}
                                    >
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                                        <span className="text-[13px] text-white/75">{cat.name}</span>
                                        {String(value) === String(cat.id) && (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 ml-auto" />
                                        )}
                                    </button>
                                ))}

                                {/* Create new option */}
                                {canCreate && (
                                    <div className="border-t border-white/[0.06]">
                                        {/* Color picker */}
                                        <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
                                            <span className="text-[10.5px] text-white/25">Warna:</span>
                                            <div className="flex gap-1">
                                                {COLORS.map(col => (
                                                    <button key={col} type="button"
                                                        onClick={() => setPendingColor(col)}
                                                        className={`w-4 h-4 rounded-full transition-transform ${pendingColor === col ? 'scale-125 ring-1 ring-white/40' : 'opacity-60 hover:opacity-100'}`}
                                                        style={{ background: col }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCreate}
                                            disabled={isCreating}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-indigo-500/[0.08] transition-colors disabled:opacity-50"
                                        >
                                            {isCreating
                                                ? <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                                : <Plus className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                            }
                                            <span className="text-[12.5px] text-indigo-300">
                                                Buat <strong>"{inputValue.trim()}"</strong>
                                            </span>
                                            <span className="ml-auto w-3 h-3 rounded-full flex-shrink-0" style={{ background: pendingColor }} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Form Page ─────────────────────────────────────────────────────────────
export default function Form({ blog, mode, categories = [] }) {
    const isEdit = mode === 'edit';
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title:            blog?.title || '',
        slug:             blog?.slug || '',
        excerpt:          blog?.excerpt || '',
        content:          blog?.content || '',
        meta_title:       blog?.meta_title || '',
        meta_description: blog?.meta_description || '',
        tags:             blog?.tags || [],
        is_published:     blog?.is_published ?? false,
        published_at:     blog?.published_at ? blog.published_at.slice(0, 16) : '',
        order:            blog?.order ?? '',
        thumbnail:        null,
        blog_category_id: blog?.blog_category_id ?? '',
    });

    const handleFileChange = (file) => {
        setData('thumbnail', file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            post(`/admin/blogs/${blog.id}?_method=PUT`, options);
        } else {
            post('/admin/blogs', options);
        }
    };

    // Auto-generate slug dari title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData('title', title);
        if (!blog?.slug || data.slug === '') {
            const slug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            setData('slug', slug);
        }
    };

    const thumbSrc = previewUrl || (isEdit ? blog?.thumbnail : null);

    return (
        <AdminLayout title={isEdit ? 'Edit Blog' : 'Tambah Blog'}>
            {/* TipTap CSS - SAMA PERSIS seperti Projects */}
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
                .tiptap-editor .is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: rgba(255,255,255,0.2);
                    pointer-events: none;
                    height: 0;
                }
            `}</style>

            <div className="max-w-4xl">
                <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar
                </Link>

                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h2 className="text-[17px] font-bold text-white mb-6">
                        {isEdit ? 'Edit Artikel' : 'Tambah Artikel Baru'}
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

                        {/* Title + Slug */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Judul Artikel" required error={errors.title}>
                                <Input value={data.title} onChange={handleTitleChange}
                                    placeholder="Judul artikel..." error={errors.title} />
                            </FormField>
                            <FormField label="Slug (URL)" error={errors.slug} hint="auto-generate jika kosong">
                                <Input value={data.slug} onChange={e => setData('slug', e.target.value)}
                                    placeholder="judul-artikel-anda" error={errors.slug} />
                            </FormField>
                        </div>

                        {/* Category */}
                        <FormField label="Kategori" error={errors.blog_category_id}>
                            <CategorySelect
                                value={data.blog_category_id}
                                onChange={val => setData('blog_category_id', val)}
                                error={errors.blog_category_id}
                            />
                        </FormField>

                        {/* Excerpt */}
                        <FormField label="Excerpt / Ringkasan" error={errors.excerpt} hint="maks. 500 karakter">
                            <TextArea value={data.excerpt} onChange={e => setData('excerpt', e.target.value)}
                                rows={3} maxLength={500} error={errors.excerpt} />
                        </FormField>

                        {/* Content — TipTap Editor */}
                        <FormField label="Konten Artikel" error={errors.content}>
                            <RichTextEditor
                                value={data.content}
                                onChange={(html) => setData('content', html)}
                                error={errors.content}
                                uploadUrl="/admin/blogs/upload-image"
                            />
                        </FormField>

                        <div className="border-t border-white/[0.06]" />

                        {/* Tags */}
                        <FormField label="Tags" error={errors.tags} hint="tekan Enter atau koma untuk tambah">
                            <TagsInput 
                                value={data.tags} 
                                onChange={tags => setData('tags', tags)} 
                            />
                        </FormField>

                        {/* URLs SEO */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Meta Title" error={errors.meta_title} hint="SEO, maks. 60 karakter">
                                <Input value={data.meta_title} onChange={e => setData('meta_title', e.target.value)}
                                    maxLength={60} placeholder={data.title} error={errors.meta_title} />
                            </FormField>
                            <FormField label="Meta Description" error={errors.meta_description} hint="SEO, maks. 160 karakter">
                                <Input value={data.meta_description} onChange={e => setData('meta_description', e.target.value)}
                                    maxLength={160} placeholder={data.excerpt} error={errors.meta_description} />
                            </FormField>
                        </div>

                        {/* Order + Published */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Urutan Tampil" error={errors.order} hint="angka kecil = tampil duluan">
                                <Input type="number" min="0" value={data.order}
                                    onChange={e => setData('order', e.target.value)}
                                    placeholder="0" error={errors.order} />
                            </FormField>
                            <FormField label="Status Publikasi">
                                <button
                                    type="button"
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className={`h-10 w-full flex items-center gap-3 px-4 rounded-lg border transition-all text-[13.5px] ${
                                        data.is_published
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                            : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:border-white/20'
                                    }`}
                                >
                                    {data.is_published 
                                        ? <CheckCircle2 className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                                        : <Eye className="w-4 h-4" />
                                    }
                                    {data.is_published ? 'Published (Tampil Publik)' : 'Draft (Privat)'}
                                </button>
                            </FormField>
                        </div>

                        {/* Published At */}
                        <FormField label="Tanggal Publish" error={errors.published_at} hint="opsional, auto-set jika Published">
                            <Input type="datetime-local" value={data.published_at}
                                onChange={e => setData('published_at', e.target.value)}
                                error={errors.published_at} />
                        </FormField>

                        <div className="border-t border-white/[0.06]" />

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button type="submit" loading={processing} className="flex-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Artikel'}
                            </Button>
                            <Link href="/admin/blogs">
                                <Button type="button" variant="outline">Batal</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}