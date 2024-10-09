'use client'

import { findChecklist } from '@/server-actions/checklist/find'
import { CheckListItem } from '@/types/CheckListItem'
import { ChevronLeftIcon, CirclePlusIcon, HouseIcon, Loader2Icon } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { createChecklist } from '@/server-actions/checklist/create'
import { InputGroupAdd } from './input-group-add'
import { CheckListItemComponent } from './checklist-item'
import { updateChecklist } from '@/server-actions/checklist/update'

export const CheckListWrapper = () => {
  const [item, setItem] = useState<CheckListItem | null>(null)
  const [items, setItems] = useState<CheckListItem[] | null>(null)

  const [showInputAdd, setShowInputAdd] = useState(false)
  const [description, setDescription] = useState('')
  const [adding, startAdd] = useTransition()

  const refDiv = useRef<HTMLDivElement>(null)

  const _update = (old: CheckListItem[] | null, item: CheckListItem) => {
    if (!old) return null
    const _old = [...old]
    const index = _old.findIndex(i => i.id === item.id)
    _old[index] = { ...item }
    return _old
  }

  const onItemChangeHandler = (item: CheckListItem) => {
    if (!items) return
    const backup = JSON.parse(JSON.stringify(items)) as CheckListItem[]

    setItems(old => _update(old, item))

    updateChecklist(item.id, {
      description: item.description,
      checked: item.checked,
    })
      .then(updated => {
        setItems(old => _update(old, updated))
      })
      .catch(() => {
        setItems(old => old ? backup : null)
      })
  }

  const addHandler = () => startAdd(() => {
    createChecklist({
      description,
      parentId: item?.id || null
    })
      .then(newItem => {
        if (!items) {
          setItems([newItem])
        } else {
          setItems(_items => _items ? [..._items, newItem] : [newItem])
        }
        setDescription('')
        refDiv.current?.focus()
      })
  })

  const fetchItems = useCallback(() => {
    setItems(null)
    findChecklist(item?.id)
      .then(setItems)
  }, [item?.id])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    if (!showInputAdd) {
      setDescription('')
      return
    }
    const hide = () => {
      console.log(refDiv.current, document.activeElement)
      if (refDiv.current?.contains(document.activeElement)) return
      setShowInputAdd(false)
    }
    document.addEventListener('click', hide)
    return () => document.removeEventListener('click', hide)
  }, [showInputAdd])

  return (
    <div className='flex flex-col w-full max-w-2xl bg-gray-900 border border-gray-800 mx-auto my-10 p-4 rounded-md space-y-4'>
      <h1 className='text-2xl font-bold'>CheckList v2</h1>

      {/* Way */}
      <div className='flex w-full justify-between'>
        {item ? (
          <span className='flex items-center gap-x-2'>
            <button type='button' onClick={() => setItem(item.parent)} className=''>
              <span className="sr-only">Open</span>
              <ChevronLeftIcon className='w-4 h-4 text-purple-400' />
            </button>
            {item.description}
          </span>
        ) : (
          <span className='flex items-center gap-x-2'>
            <HouseIcon className='w-4 h-4 text-purple-400' />
            CheckList
          </span>
        )}

        <div>
          <button type='button' onClick={() => setShowInputAdd(!showInputAdd)} className=''>
            <span className="sr-only">Add</span>
            <CirclePlusIcon className='w-5 h-5 hover:text-purple-400' />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className='flex flex-col w-full sapce-y-1'>
        {items ? items.map(children => (
          <CheckListItemComponent
            key={children.id}
            item={children}
            onSelect={() => setItem(children)}
            onChange={onItemChangeHandler}
          />
        )) : <Loader2Icon className='w-6 h-6 animate-spin m-auto' />}

        {showInputAdd && (
          <InputGroupAdd
            ref={refDiv}
            value={description}
            disabled={adding}
            onChange={setDescription}
            onSubmit={addHandler}
            onCancel={() => setShowInputAdd(false)}
          />
        )}
      </div>
    </div>
  )
}
