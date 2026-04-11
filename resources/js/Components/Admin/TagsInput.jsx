// resources/js/Components/Admin/TagsInput.jsx
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TagsInput({ value = [], onChange, placeholder = 'Tambah tags...' }) {
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
                <span key={tag} className="inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    {tag}
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(tag); }} className="ml-0.5 opacity-60 hover:opacity-100">
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