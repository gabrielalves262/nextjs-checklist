'use client'

import { findChecklist } from '@/server-actions/checklist/find'
import { CheckListItem } from '@/types/CheckListItem'
import { Loader2Icon, PlusIcon, XIcon } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { CheckListItemComponent } from './components/checklist-item'
import { createChecklist } from '@/server-actions/checklist/create'

export const ChecklistClientPage = () => {
  const [items, setItems] = useState<CheckListItem[] | null>(null)

  const [showAdd, setShowAdd] = useState(false)
  const [description, setDescription] = useState('')
  const [adding, startAdd] = useTransition()

  const refDiv = useRef<HTMLDivElement>(null)

  const addHandler = () => {
    startAdd(() => {
      createChecklist({
        description,
      })
        .then(newItem => {
          if (!items) {
            setItems([newItem])
          } else {
            setItems(_items => _items ? [..._items, newItem] : [newItem])
          }
          setShowAdd(false)
        })
    })
  }

  const onChange = (_item: CheckListItem) => {
    if (!items) return
    const _items = [...items]

    const index = _items.findIndex(item => item.id === _item.id)
    if (index < 0) return

    _items[index] = { ..._item }
    if (_items[index].hasChildren) {
      _items[index].childrens.forEach(item => onChange(item))
    }
    setItems(_items)
  }

  const fetchItems = useCallback(() => {
    findChecklist().then(setItems)
  }, [])

  useEffect(() => fetchItems(), [fetchItems])

  useEffect(() => {
    if (!showAdd) {
      setDescription('')
      return
    }

    const hide = () => {
      if (refDiv.current?.contains(document.activeElement)) return
      setShowAdd(false)
    }
    document.addEventListener('click', hide)
    return () => document.removeEventListener('click', hide)
  }, [showAdd])

  return (
    <div className='p-6 flex flex-col w-full max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold'>Lista de Tarefas</h1>

      <button
        type='button'
        className='flex items-center gap-x-2 my-4'
        onClick={() => setShowAdd(true)}
      >
        <PlusIcon className='w-4 h-4' />
        Adicionar Item
      </button>

      <div className="flex flex-col gap-y-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-500 dark:border-gray-800">
        {!items ? (
          <Loader2Icon className='w-6 h-6 animate-spin m-auto' />
        ) : items.map(item => (
          <CheckListItemComponent
            key={item.id}
            item={item}
            onItemChange={onChange}
          />
        ))}
        
        {showAdd && (
          <div ref={refDiv} className="flex items-center gap-x-2">
            {adding
              ? <Loader2Icon className='w-4 h-4 animate-spin' />
              : (
                <>
                  <input
                    type='text'
                    className='bg-transparent border rounded-md ml-6 p-2 text-sm border-gray-500'
                    placeholder='Adicionar item...'
                    autoFocus
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addHandler()}
                  />
                  <button
                    type='button'
                    className='w-4 h-4'
                    onClick={() => setShowAdd(false)}
                  >
                    <span className="sr-only">Cancelar</span>
                    <XIcon className='w-4 h-4' />
                  </button>
                  <button
                    type='button'
                    className='w-4 h-4'
                    onClick={addHandler}
                  >
                    <span className="sr-only">Adicionar</span>
                    <PlusIcon className='w-4 h-4' />
                  </button>
                </>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
