interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="bg-[#253342] w-full min-h-[60px] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  )
}
