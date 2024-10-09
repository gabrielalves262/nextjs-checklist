import { CheckListItem as PrismaCheckListItem } from '@prisma/client'

type CheckListItem = PrismaCheckListItem & {
  childrens?: CheckListItem[]
}

export const calcTotalChildrens = (item: CheckListItem): { total: number, checked: number } => {
  return {
    total: _countTotal(item),
    checked: _countChecked(item)
  }
}

const _countTotal = (item: CheckListItem): number => {
  let total = item.childrens?.length || 0
  item.childrens?.forEach(a => {
    total += _countTotal(a)
  })
  return total
}

const _countChecked = (item: CheckListItem): number => {
  let total = item.childrens?.filter(a => a.checked).length || 0
  item.childrens?.filter(a => a.checked).forEach(a => {
    total += _countTotal(a)
  })
  return total
}