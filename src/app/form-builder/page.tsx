'use client'
import { Toaster } from '@/components/ui/toaster'
import { FormBuilderProvider } from '@/modules/form-builder/contexts/FormBuilderContext'
import { FormBuilderPage } from '@/modules/form-builder2/pages/FormBuilder'

export default function Page() {
  return (
    <FormBuilderProvider>
      <FormBuilderPage />
      <Toaster />
    </FormBuilderProvider>
  )
}
