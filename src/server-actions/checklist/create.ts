'use server'

import { db } from "@/lib/db"
import { CheckListItem } from "@/types/CheckListItem"

type Dto = {
  description: string
  parentId?: string | null
}

export const createChecklist = async (data: Dto): Promise<CheckListItem> => {
  const checklist = await db.checkListItem.create({ data, include: { parent: true, childrens: true } })
  return {
    ...checklist,
    hasChildren: false,
    count: {
      childrens: {
        total: checklist.childrens.length,
        checked: checklist.childrens.filter(item => item.checked).length
      }
    },
    parent: checklist.parent ? {
      ...checklist.parent,
      hasChildren: true,
      parent: null,
      count: {
        childrens: null
      }
    } : null
  }
}