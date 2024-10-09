'use client'

import { CheckListItem } from '@/types/CheckListItem'
import { Transition } from '@headlessui/react'
import { CircleChevronRight } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  item: CheckListItem
  onSelect: () => void
  onChange: (item: CheckListItem) => void
}

export const CheckListItemComponent = ({ item, onSelect, onChange }: Props) => {
  return (
    <div className='flex items-start justify-between gap-x-4 group hover:bg-gray-800 px-2 py-1 rounded-md'>
      <div className='flex items-start gap-x-2'>
        <input
          type='checkbox'
          checked={item.checked}
          onChange={e => onChange({ ...item, checked: e.target.checked })}
          className='mt-1'
          title={item.description}
        />

        <Transition show={!!item} appear >
          <span
            className={twMerge(
              'transition-all duration-[400ms]',
              'data-[closed]:opacity-0 data-[closed]:ml-10',
              'data-[leave]:duration-[200ms] data-[leave]:ease-in-out',
            )}>
            {item.description}
            {(item.count.childrens && item.count.childrens.total > 0) && (
              <div className='text-xs text-gray-400 inline ml-2'>
                {item.count.childrens.checked}/{item.count.childrens.total}
              </div>
            )}
          </span>
        </Transition>
      </div>
      <div className='flex items-center gap-x-2'>
        <button type='button' onClick={onSelect} className='opacity-0 group-hover:opacity-100 mt-0.5'>
          <span className="sr-only">Open</span>
          <CircleChevronRight className='w-5 h-5 text-purple-400' />
        </button>
      </div>
    </div>
  )
}
