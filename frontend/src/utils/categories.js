export const CATEGORIES = [
  { id: 'lacteos',    name: 'Lácteos',           icon: '🥛', color: 'bg-blue-100 text-blue-700' },
  { id: 'carnes',     name: 'Carnes',             icon: '🥩', color: 'bg-red-100 text-red-700' },
  { id: 'verduras',   name: 'Verduras y Frutas',  icon: '🥦', color: 'bg-green-100 text-green-700' },
  { id: 'panaderia',  name: 'Panadería',          icon: '🍞', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'almacen',    name: 'Almacén',            icon: '🥫', color: 'bg-orange-100 text-orange-700' },
  { id: 'limpieza',   name: 'Limpieza',           icon: '🧹', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'higiene',    name: 'Higiene Personal',   icon: '🧴', color: 'bg-purple-100 text-purple-700' },
  { id: 'bebidas',    name: 'Bebidas',            icon: '🥤', color: 'bg-sky-100 text-sky-700' },
  { id: 'congelados', name: 'Congelados',         icon: '❄️', color: 'bg-slate-100 text-slate-700' },
  { id: 'snacks',     name: 'Golosinas y Snacks', icon: '🍬', color: 'bg-pink-100 text-pink-700' },
  { id: 'otros',      name: 'Otros',              icon: '📦', color: 'bg-gray-100 text-gray-700' },
]

export const UNITS = ['unidad', 'kg', 'g', 'L', 'ml', 'docena', 'paquete', 'caja', 'lata', 'botella']

export const getCategoryInfo = (name) =>
  CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1]
