interface ContainerMainProps {
  header: React.ReactNode
  children: React.ReactNode
}
export const ContainerMain = ({ children, header }: ContainerMainProps) => {
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {header}
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
