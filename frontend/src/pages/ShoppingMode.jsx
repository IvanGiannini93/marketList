import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { listService } from '../services/listService'
import { itemService } from '../services/itemService'
import ProgressBar from '../components/ui/ProgressBar'
import { getCategoryInfo } from '../utils/categories'

function groupByCategory(items) {
  return items.reduce((acc, item) => {
    const key = item.category || 'Sin categoría'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

export default function ShoppingMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [list, setList] = useState(null)
  const [filter, setFilter] = useState('pending') // 'pending' | 'all'

  const load = async () => {
    setList(await listService.getOne(id))
  }

  useEffect(() => { load() }, [id])

  const handleToggle = async (itemId) => {
    await itemService.toggle(id, itemId)
    load()
  }

  if (!list) return <div className="text-center py-16 text-gray-400">Cargando...</div>

  const items = list.items || []
  const checked = items.filter((i) => i.checked).length
  const total = items.length
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100)

  const visible = filter === 'pending' ? items.filter((i) => !i.checked) : items
  const grouped = groupByCategory(visible)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/lists/${id}`)} className="p-2 -ml-2 rounded-lg hover:bg-primary-700">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold truncate">{list.name}</h1>
              <p className="text-primary-100 text-sm">{checked} / {total} comprados · {pct}%</p>
            </div>
          </div>
          <ProgressBar value={checked} max={total} className="mt-2 bg-primary-500" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex rounded-lg bg-white border border-gray-200 p-1 mb-4">
          {[['pending', 'Solo pendientes'], ['all', 'Todos']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors
                ${filter === val ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-600 font-medium">¡Todos los productos comprados!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, catItems]) => {
            const info = getCategoryInfo(category)
            return (
              <div key={category} className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span>{info.icon}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{category}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {catItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleToggle(item.id)}
                      className={`w-full text-left bg-white rounded-xl border px-4 py-3 flex items-center gap-4 transition-all
                        ${item.checked ? 'border-primary-200 bg-primary-50 opacity-60' : 'border-gray-200 hover:border-primary-300'}`}
                    >
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0
                        ${item.checked ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300'}`}>
                        {item.checked && <span className="text-sm">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-base ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} {item.unit}
                          {item.estimatedPrice && ` · $${Number(item.estimatedPrice).toLocaleString('es-AR')}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
