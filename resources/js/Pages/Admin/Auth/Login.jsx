// resources/js/Pages/Admin/Auth/Login.jsx

import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
    const { errors: pageErrors } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            {/* CSS untuk mengatasi autofill browser */}
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #111111 inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                
                /* Untuk input yang sedang focus dengan autofill */
                input:focus:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 30px rgba(99, 102, 241, 0.03) inset !important;
                }
                
                /* Untuk input error dengan autofill */
                input.border-red-500\/50:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 30px #111111 inset !important;
                }
            `}</style>
            
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                {/* Background grid */}
                <div
                    className="fixed inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Glow */}
                <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative w-full max-w-[400px]">
                    {/* Card */}
                    <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/60">

                        {/* Header */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-[20px] font-bold text-white tracking-tight">Admin Panel</h1>
                            <p className="text-[13px] text-white/40 mt-1">Masukkan kredensial Anda untuk melanjutkan</p>
                        </div>

                        {/* Flash error */}
                        {pageErrors?.error && (
                            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] rounded-lg px-4 py-3 mb-5">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {pageErrors.error}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-[12px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="admin@example.com"
                                        autoComplete="email"
                                        className={`w-full h-11 bg-white/[0.04] border rounded-lg pl-10 pr-4 text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${
                                            errors.email
                                                ? 'border-red-500/50 focus:border-red-500'
                                                : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[12px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className={`w-full h-11 bg-white/[0.04] border rounded-lg pl-10 pr-11 text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${
                                            errors.password
                                                ? 'border-red-500/50 focus:border-red-500'
                                                : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setData('remember', !data.remember)}
                                    className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                                        data.remember
                                            ? 'bg-indigo-500 border-indigo-500'
                                            : 'bg-transparent border-white/20 hover:border-white/40'
                                    }`}
                                    style={{ width: '18px', height: '18px' }}
                                >
                                    {data.remember && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                                <span className="text-[13px] text-white/50 select-none cursor-pointer" onClick={() => setData('remember', !data.remember)}>
                                    Ingat saya
                                </span>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13.5px] font-semibold rounded-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        Masuk ke Panel Admin
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-[12px] text-white/20 mt-5">
                        &copy; {new Date().getFullYear()} Admin Panel · Izza Wildan
                    </p>
                </div>
            </div>
        </>
    );
}