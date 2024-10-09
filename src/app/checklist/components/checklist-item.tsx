import { createChecklist } from '@/server-actions/checklist/create'
import { findChecklist } from '@/server-actions/checklist/find'
import { updateChecklist } from '@/server-actions/checklist/update'
import { CheckListItem } from '@/types/CheckListItem'
import { Loader2Icon, PlusIcon, SquareMinusIcon, SquarePlusIcon, XIcon } from 'lucide-react'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  item: CheckListItem
  onItemChange: (item: CheckListItem) => void
  autoFetch?: boolean
} & React.ComponentProps<'div'>

export const CheckListItemComponent = ({ item, onItemChange, className, ...props }: Props) => {
  const [items, setItems] = useState<CheckListItem[] | null>(null)
  const [fetching, startFetch] = useTransition()
  const [changing, startChange] = useTransition()

  const [showAdd, setShowAdd] = useState(false)
  const [description, setDescription] = useState('')
  const [adding, startAdd] = useTransition()

  const refDiv = useRef<HTMLDivElement>(null)

  const fetchItems = useCallback(() => {
    startFetch(() => {
      findChecklist(item.id)
        .then(setItems)
    })
  }, [item.id])

  const onChange = (_item: CheckListItem) => {
    if (!items) return
    const _items = [...items]

    const index = _items.findIndex(item => item.id === _item.id)
    if (index < 0) return


    _items[index] = { ..._item }
    setItems(_items)
  }

  const onCheckHandler = (e: ChangeEvent<HTMLInputElement>) => {
    startChange(() => {
      updateChecklist(item.id, { checked: e.target.checked })
        .then(() => {
          onItemChange({ ...item, checked: e.target.checked })
        })
        .catch(() => {})
    })
  }

  const addHandler = () => {
    startAdd(() => {
      createChecklist({
        description,
        parentId: item.id
      })
        .then(newItem => {
          if (!items) {
            setItems([newItem])
          } else {
            setItems(_items => _items ? [..._items, newItem] : [newItem])
          }
          onItemChange({ ...item, hasChildren: true })
          setShowAdd(false)
        })
    })
  }

  useEffect(() => {
    if (props.autoFetch)
      fetchItems()
  }, [fetchItems, props.autoFetch])

  useEffect(() => {
    if (!showAdd) {
      setDescription('')
      return
    }
    if (item.hasChildren)
      fetchItems()
    const hide = () => {
      if (refDiv.current?.contains(document.activeElement)) return
      setShowAdd(false)
    }
    document.addEventListener('click', hide)
    return () => document.removeEventListener('click', hide)
  }, [showAdd, fetchItems, item.hasChildren])

  return (
    <div
      className={twMerge(
        'w-full flex flex-col gap-y-1 relative',
        (item.hasChildren && items) && 'after:flex after:w-1 after:h-[calc(100%-32px)] after:absolute after:left-2 after:top-6 after:border-l after:border-b after:border-foreground/50 after:content-[""]',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-x-2 group">
        {item.hasChildren ? (
          <button
            className='w-4 h-4 flex items-center justify-center'
            onClick={() => items ? setItems(null) : fetchItems()}
          >
            {fetching
              ? <Loader2Icon className='w-4 h-4 animate-spin' />
              : items
                ? <SquareMinusIcon className='w-4 h-4' />
                : <SquarePlusIcon className='w-4 h-4' />
            }
          </button>
        ) : <div className='w-4 h-4' />}
        {!changing
          ? <input type="checkbox" checked={item.checked} onChange={onCheckHandler} title='check' />
          : <Loader2Icon className='w-4 h-4 animate-spin' />
        }
        <span>{item.description}</span>
        <button
          type='button'
          className='w-4 h-4 hidden group-hover:block'
          onClick={() => setShowAdd(true)}
        >
          <span className="sr-only">Adicionar item</span>
          <PlusIcon className='w-4 h-4' />
        </button>
      </div>
      {(items || fetching || showAdd) && (
        <div className="flex flex-col pl-6">
          {fetching ? (
            <div className='flex items-center gap-x-2'>
              <Loader2Icon className='w-4 h-4 animate-spin' />
              <span>Carregando...</span>
            </div>
          ) : (
            items?.map(item => (
              <CheckListItemComponent
                key={item.id}
                item={item}
                onItemChange={onChange}
              />
            ))
          )}
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
      )}
    </div>
  )
}
