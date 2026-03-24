import { Pencil, Trash2 } from 'lucide-react'
import { getCategoryInfo } from '../../utils/categories'

export default function ItemRow({ item, onToggle, onEdit, onDelete }) {
  const cat = getCategoryInfo(item.category)

  return (
    <div className={`flex items-center gap-3 py-3 px-1 border-b border-gray-100 last:border-0 ${item.checked ? 'opacity-50' : ''}`}>
      <button
        onClick={() => onToggle(item.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          ${item.checked ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 hover:border-primary-400'}`}
        aria-label={item.checked ? 'Desmarcar' : 'Marcar como comprado'}
      >
        {item.checked && <span className="text-xs">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-400">
          {item.quantity} {item.unit}
          {item.estimatedPrice && ` · $${Number(item.estimatedPrice).toLocaleString('es-AR')}`}
          {item.notes && ` · ${item.notes}`}
        </p>
      </div>

      {item.category && (
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${cat.color}`}>
          {cat.icon}
        </span>
      )}

      <div className="flex gap-1 shrink-0">
        <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
