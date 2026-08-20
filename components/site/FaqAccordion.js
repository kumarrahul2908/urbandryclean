'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function FaqAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((it, i) => {
        const open = openIdx === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="font-semibold text-[15px] text-slate-900">{it.q}</span>
              <span className="shrink-0 h-8 w-8 rounded-md flex items-center justify-center bg-slate-50 text-slate-600">
                {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div className={`grid transition-all duration-200 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-[14.5px] text-slate-600 leading-relaxed">{it.a}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
