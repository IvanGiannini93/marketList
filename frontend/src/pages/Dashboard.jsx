import { useEffect, useState } from 'react'
import { Plus, LogOut, ShoppingCart } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { listService } from '../services/listService'
import ListCard from '../components/lists/ListCard'
import ListForm from '../components/lists/ListForm'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | { mode: 'create' | 'edit', list? }

  const load = async () => {
    try {
      setLists(await listService.getAll())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (data) => {
    if (modal.mode === 'create') {
      await listService.create(data)
    } else {
      await listService.update(modal.list.id, data)
    }
    load()
  }

  const handleDelete = async (list) => {
    if (!confirm(`¿Eliminar "${list.name}"?`)) return
    await listService.delete(list.id)
    load()
  }

  const handleDuplicate = async (list) => {
    await listService.duplicate(list.id)
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary-600" />
            <span className="font-semibold text-gray-900">Mis Listas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando...</div>
        ) : lists.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 mb-4">Todavía no tenés listas</p>
            <Button onClick={() => setModal({ mode: 'create' })}>
              <Plus size={16} /> Crear primera lista
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onEdit={(l) => setModal({ mode: 'edit', list: l })}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </main>

      {lists.length > 0 && (
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label="Nueva lista"
        >
          <Plus size={24} />
        </button>
      )}

      {modal && (
        <ListForm
          list={modal.list}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
