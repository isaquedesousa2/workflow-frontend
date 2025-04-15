import { FormBuilderProvider } from '@/modules/form-builder2/contexts/FormBuilderContext'

export default function FormBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <FormBuilderProvider>
      <div className="flex flex-col h-screen">{children}</div>
    </FormBuilderProvider>
  )
}
