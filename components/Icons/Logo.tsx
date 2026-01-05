import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className = "", size = 100 }: LogoProps) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Outer glow */}
            <div
                className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"
                style={{ width: size, height: size }}
            />

            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            >
                <path
                    d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-400"
                />
                <path
                    d="M14.7 6.3l3.77-3.77"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-400 opacity-50"
                />
            </svg>
        </div>
    );
}
