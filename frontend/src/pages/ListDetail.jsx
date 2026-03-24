import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { listService } from '../services/listService'
import { itemService } from '../services/itemService'
import ItemRow from '../components/items/ItemRow'
import ItemForm from '../components/items/ItemForm'
import Button from '../components/ui/Button'
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

export default function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [itemModal, setItemModal] = useState(null) // null | { mode, item? }

  const load = async () => {
    try {
      setList(await listService.getOne(id))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleSaveItem = async (data) => {
    if (itemModal.mode === 'add') {
      await itemService.add(id, data)
    } else {
      await itemService.update(id, itemModal.item.id, data)
    }
    load()
  }

  const handleToggle = async (itemId) => {
    await itemService.toggle(id, itemId)
    load()
  }

  const handleDeleteItem = async (itemId) => {
    await itemService.delete(id, itemId)
    load()
  }

  const handleClearChecked = async () => {
    if (!confirm('¿Eliminar todos los productos comprados?')) return
    await itemService.clearChecked(id)
    load()
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Cargando...</div>
  if (!list) return <div className="text-center py-16 text-gray-400">Lista no encontrada</div>

  const items = list.items || []
  const checked = items.filter((i) => i.checked).length
  const total = items.length
  const estimatedTotal = items
    .filter((i) => i.estimatedPrice)
    .reduce((s, i) => s + Number(i.estimatedPrice) * Number(i.quantity), 0)
  const spentSoFar = items
    .filter((i) => i.checked && i.estimatedPrice)
    .reduce((s, i) => s + Number(i.estimatedPrice) * Number(i.quantity), 0)

  const grouped = groupByCategory(items)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-semibold text-gray-900 flex-1 truncate">{list.name}</h1>
            <Button onClick={() => navigate(`/lists/${id}/shopping`)} className="shrink-0">
              <ShoppingCart size={16} /> Comprar
            </Button>
          </div>
          {total > 0 && (
            <div className="mt-2">
              <ProgressBar value={checked} max={total} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{checked}/{total} comprados</span>
                {estimatedTotal > 0 && (
                  <span>${spentSoFar.toLocaleString('es-AR')} / ${estimatedTotal.toLocaleString('es-AR')}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => setItemModal({ mode: 'add' })}>
            <Plus size={16} /> Agregar producto
          </Button>
          {checked > 0 && (
            <button onClick={handleClearChecked} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500">
              <Trash2 size={14} /> Limpiar comprados
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>La lista está vacía</p>
            <p className="text-sm mt-1">Agregá productos para empezar</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, catItems]) => {
            const info = getCategoryInfo(category)
            return (
              <div key={category} className="mb-4">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span>{info.icon}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{category}</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 px-3">
                  {catItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggle={handleToggle}
                      onEdit={(i) => setItemModal({ mode: 'edit', item: i })}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </main>

      {itemModal && (
        <ItemForm
          item={itemModal.item}
          onSave={handleSaveItem}
          onClose={() => setItemModal(null)}
        />
      )}
    </div>
  )
}
