import type { HTMLAttributes } from 'react'

export default function Card({ className = '', ...resto }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`} {...resto} />
}
