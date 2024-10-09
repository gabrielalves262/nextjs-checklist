'use server'

import { db } from "@/lib/db"
import { CheckListItem } from "@/types/CheckListItem"
import { Prisma } from "@prisma/client"
import { calcTotalChildrens } from "./utils"


export const findOneChecklist = async (id: string): Promise<CheckListItem | null> => {
  const checklist = await db.checkListItem.findUnique({
    where: { id },
    include: {
      parent: true,
      childrens: includeNestedChildrens(10),
    }
  })

  return checklist ? {
    ...checklist,
    hasChildren: checklist.childrens.length > 0,
    count: {
      childrens: calcTotalChildrens(checklist)
    },
    parent: checklist.parent ? {
      ...checklist.parent,
      hasChildren: true,
      parent: null,
      count: {
        childrens: null
      }
    } : null
  } : null
}

export const findChecklist = async (parentId: string | null = null): Promise<CheckListItem[]> => {
  const checklist = await db.checkListItem.findMany({
    where: { parentId },
    include: {
      parent: true,
      childrens: includeNestedChildrens(10),
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  return checklist.map<CheckListItem>(item => ({
    ...item,
    count: {
      childrens: calcTotalChildrens(item)
    },
    hasChildren: item.childrens.length > 0,
    parent: item.parent ? { 
      ...item.parent, 
      hasChildren: true, 
      parent: null,
      count: {
        childrens: null
      }
    } : null
  }))
}


const includeNestedChildrens = (
  maximumLevel: number,
): boolean | Prisma.CheckListItem$childrensArgs => {
  if (maximumLevel === 1) {
    return true;
  }
  return {
    include: {
      childrens: includeNestedChildrens(maximumLevel - 1),
    },
  };
}

