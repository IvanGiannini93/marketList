import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { CATEGORIES, UNITS } from '../../utils/categories'

const empty = { name: '', quantity: '1', unit: 'unidad', category: '', estimatedPrice: '', notes: '' }

export default function ItemForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item ? {
    name: item.name,
    quantity: String(item.quantity),
    unit: item.unit,
    category: item.category || '',
    estimatedPrice: item.estimatedPrice ? String(item.estimatedPrice) : '',
    notes: item.notes || '',
  } : empty)
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setLoading(true)
    try {
      await onSave({
        name: form.name.trim(),
        quantity: parseFloat(form.quantity) || 1,
        unit: form.unit,
        category: form.category || null,
        estimatedPrice: form.estimatedPrice ? parseFloat(form.estimatedPrice) : null,
        notes: form.notes.trim() || null,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={item ? 'Editar producto' : 'Agregar producto'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="Nombre *" value={form.name} onChange={set('name')} placeholder="Ej: Leche" autoFocus />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Cantidad *" type="number" min="0.01" step="0.01" value={form.quantity} onChange={set('quantity')} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Unidad</label>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              value={form.unit}
              onChange={set('unit')}
            >
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Categoría</label>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            value={form.category}
            onChange={set('category')}
          >
            <option value="">Sin categoría</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Precio estimado (opcional)"
          type="number" min="0" step="0.01"
          value={form.estimatedPrice}
          onChange={set('estimatedPrice')}
          placeholder="0.00"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Notas (opcional)</label>
          <textarea
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
            rows={2}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Ej: Marca X, sin TACC..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading || !form.name.trim()}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
