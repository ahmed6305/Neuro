"use client"
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

// Simple Event Bus for Toasts
const listeners: Set<(toast: Toast) => void> = new Set()

export const toast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, message, type }
    listeners.forEach(listener => listener(newToast))
}

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleToast = (newToast: Toast) => {
            setToasts(prev => [...prev, newToast])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id))
            }, 3000)
        }

        listeners.add(handleToast)
        return () => {
            listeners.delete(handleToast)
        }
    }, [])

    if (!mounted) return null

    const portalElement = document.getElementById('toast-container')
    if (!portalElement) return null

    return createPortal(
        <div className="flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`
              pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-2xl border backdrop-blur-md text-sm font-medium
              ${t.type === 'success' ? 'bg-neon-green/10 border-neon-green text-neon-green' : ''}
              ${t.type === 'error' ? 'bg-neon-red/10 border-neon-red text-neon-red' : ''}
              ${t.type === 'info' ? 'bg-slate-800/80 border-slate-700 text-slate-200' : ''}
            `}
                    >
                        <div className="flex items-center gap-3">
                            {t.type === 'success' && <span>✅</span>}
                            {t.type === 'error' && <span>❌</span>}
                            {t.type === 'info' && <span>ℹ️</span>}
                            {t.message}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>,
        portalElement
    )
}
