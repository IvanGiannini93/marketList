import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Copy, ShoppingCart } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar'

export default function ListCard({ list, onEdit, onDelete, onDuplicate }) {
  const navigate = useNavigate()
  const pct = list.totalItems === 0 ? 0 : Math.round((list.checkedItems / list.totalItems) * 100)

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/lists/${list.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{list.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {list.totalItems} producto{list.totalItems !== 1 ? 's' : ''}
            {list.estimatedTotal > 0 && ` · $${list.estimatedTotal.toLocaleString('es-AR')}`}
          </p>
        </div>
        <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/lists/${list.id}/shopping`)}
            className="p-2 rounded-lg hover:bg-primary-50 text-primary-600"
            title="Modo compra"
          >
            <ShoppingCart size={16} />
          </button>
          <button
            onClick={() => onDuplicate(list)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            title="Duplicar"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onEdit(list)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(list)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-400"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {list.totalItems > 0 && (
        <div className="mt-3">
          <ProgressBar value={list.checkedItems} max={list.totalItems} />
          <p className="text-xs text-gray-400 mt-1">{list.checkedItems}/{list.totalItems} comprados · {pct}%</p>
        </div>
      )}
    </div>
  )
}
