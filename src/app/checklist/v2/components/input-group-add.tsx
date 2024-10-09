'use client'

import { CheckIcon, XIcon } from 'lucide-react'
import React, { ForwardedRef, forwardRef } from 'react'

interface Props {
  value: string
  disabled: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

const InputGroupAdd = forwardRef(({ value, disabled, onChange, onCancel, onSubmit }: Props, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className='flex items-center gap-x-2 mt-4'>
      <input
        type='text'
        className='bg-transparent w-full border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus-visible:outline-none'
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter')
            onSubmit()
          else if (e.key === 'Escape')
            onCancel()
        }}
        placeholder='+ Adicionar Item'
        autoFocus
        disabled={disabled}
      />
      <button
        type='button'
        onClick={onSubmit}
        className='flex items-center justify-center rounded-md p-2.5 border border-gray-700 hover:border-green-400'
      >
        <span className="sr-only">Add</span>
        <CheckIcon className='w-5 h-5 text-green-400' />
      </button>
      <button
        type='button'
        onClick={onCancel}
        className='flex items-center justify-center rounded-md p-2.5 border border-gray-700 hover:border-red-400'
      >
        <span className="sr-only">Add</span>
        <XIcon className='w-5 h-5 text-red-400' />
      </button>
    </div>
  )
})

InputGroupAdd.displayName = 'InputGroupAdd'

export { InputGroupAdd }