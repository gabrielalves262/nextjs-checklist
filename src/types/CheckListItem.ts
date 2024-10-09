import { CheckListItem as PrismaCheckListItem } from '@prisma/client'

export type CheckListItem =
  Omit<PrismaCheckListItem, 'createdAt' | 'updatedAt'> & {
    hasChildren: boolean
    parent: CheckListItem | null
    count: {
      childrens: {
        total: number
        checked: number
      } | null
    }
  }