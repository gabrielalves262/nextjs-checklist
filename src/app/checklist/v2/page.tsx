import { Metadata } from 'next'
import React from 'react'
import { CheckListWrapper } from './components/checklist-wrapper'

export const metadata: Metadata = {
  title: '✔️ CheckList v2'
}

const CheckListV2Page = () => {
  return (
    <CheckListWrapper />
  )
}

export default CheckListV2Page