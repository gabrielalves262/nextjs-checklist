'use server'

import { db } from "@/lib/db"
import { CheckListItem } from "@/types/CheckListItem"
import { findOneChecklist } from "./find"


type Dto = {
  description?: string
  parentId?: string | null
  checked?: boolean
}

export const updateChecklist = async (id: string, data: Dto, checkAllChildren: boolean = false): Promise<CheckListItem> => {
  // Used if will check all children
  if (data.checked && checkAllChildren)
    await _update(id, data.checked)
  else
    await db.checkListItem.update({
      where: { id },
      data: {
        description: data.description || undefined,
        parentId: data.parentId,
        checked: data.checked
      }
    })

  await new Promise(resolve => setTimeout(resolve, 100))
  return (await findOneChecklist(id))!
}

// Used if will check all children
const _update = async (id: string, checked: boolean) => {
  const item = await db.checkListItem.update({
    where: { id },
    data: { checked },
    include: { childrens: true }
  })
  if (item.childrens.length > 0) {
    item.childrens.forEach(item => _update(item.id, checked))
  }
}