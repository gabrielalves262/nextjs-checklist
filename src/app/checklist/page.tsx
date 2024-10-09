import { Metadata } from 'next'
import React from 'react'
import { ChecklistClientPage } from './_client'

export const metadata: Metadata = {
  title: '✔️ CheckList'
}

const CheckListPage = () => {
  return (
    <ChecklistClientPage />
  )
}

export default CheckListPage