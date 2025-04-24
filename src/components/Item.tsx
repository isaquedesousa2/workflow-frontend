'use client'

interface ItemProps {
  id: string
}

export function Item({ id }: ItemProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move">
      Item {id}
    </div>
  )
}
