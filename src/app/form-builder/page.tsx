'use client'
import { Toaster } from '@/components/ui/toaster'
import { FormBuilderPage } from '@/modules/form-builder2/pages/FormBuilder'

export default function Page() {
  return (
    <>
      <FormBuilderPage />
      <Toaster />
    </>
  )
}
