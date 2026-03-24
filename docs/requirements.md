# Requerimientos - Aplicación de Listas de Compras

## 1. Descripción General

Aplicación web que permite a los usuarios crear, gestionar y utilizar listas de compras para el supermercado, facilitando la organización de productos por categorías y el seguimiento del estado de compra.

---

## 2. Requerimientos Funcionales

### RF-01: Gestión de Listas
- RF-01.1: El usuario puede crear una nueva lista de compras con nombre personalizado.
- RF-01.2: El usuario puede ver todas sus listas de compras.
- RF-01.3: El usuario puede editar el nombre de una lista existente.
- RF-01.4: El usuario puede eliminar una lista de compras.
- RF-01.5: El usuario puede duplicar una lista existente.

### RF-02: Gestión de Productos
- RF-02.1: El usuario puede agregar productos a una lista con nombre, cantidad y unidad de medida.
- RF-02.2: El usuario puede asignar una categoría a cada producto (ej: lácteos, carnes, verduras, limpieza).
- RF-02.3: El usuario puede editar los datos de un producto.
- RF-02.4: El usuario puede eliminar un producto de la lista.
- RF-02.5: El usuario puede agregar notas opcionales a un producto.
- RF-02.6: El usuario puede agregar precio estimado a un producto.

### RF-03: Uso en Supermercado
- RF-03.1: El usuario puede marcar productos como "comprado" durante la sesión de compra.
- RF-03.2: El usuario puede desmarcar productos marcados.
- RF-03.3: La aplicación muestra el progreso de compra (X de Y productos comprados).
- RF-03.4: Los productos comprados se muestran visualmente diferenciados (tachados/grises).
- RF-03.5: El usuario puede filtrar la lista para ver solo los pendientes.

### RF-04: Categorías
- RF-04.1: El sistema provee categorías predefinidas comunes.
- RF-04.2: El usuario puede crear categorías personalizadas.
- RF-04.3: Los productos se agrupan por categoría dentro de la lista.

### RF-05: Estimación de Presupuesto
- RF-05.1: La aplicación calcula el total estimado de la lista basado en precios ingresados.
- RF-05.2: La aplicación muestra el subtotal de productos ya comprados.

### RF-06: Persistencia
- RF-06.1: Los datos se persisten en localStorage del navegador.
- RF-06.2: Los datos no se pierden al cerrar o recargar la página.

---

## 3. Requerimientos No Funcionales

### RNF-01: Usabilidad
- Interfaz intuitiva y responsive (mobile-first, ya que se usa en el supermercado desde el celular).
- Acciones principales accesibles con una sola mano.
- Texto legible sin necesidad de zoom.

### RNF-02: Rendimiento
- Carga inicial menor a 2 segundos.
- Interacciones sin latencia perceptible (< 100ms).

### RNF-03: Compatibilidad
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge).
- Funcional en dispositivos móviles y desktop.

### RNF-04: Tecnología
- Frontend: React + TypeScript.
- Estilos: Tailwind CSS.
- Estado: Context API + useReducer o Zustand.
- Persistencia: localStorage.
- Sin backend requerido (aplicación 100% client-side).

---

## 4. Casos de Uso Principales

### CU-01: Crear lista de compras
**Actor:** Usuario  
**Flujo:** Usuario abre la app → pulsa "Nueva Lista" → ingresa nombre → confirma → la lista aparece en el dashboard.

### CU-02: Agregar producto a lista
**Actor:** Usuario  
**Flujo:** Usuario abre una lista → pulsa "Agregar producto" → completa nombre, cantidad, unidad, categoría → guarda → el producto aparece en la lista agrupado por categoría.

### CU-03: Realizar compra
**Actor:** Usuario  
**Flujo:** Usuario abre lista en el supermercado → va marcando productos conforme los toma → ve el progreso → al terminar todos los productos están marcados.

### CU-04: Estimar presupuesto
**Actor:** Usuario  
**Flujo:** Usuario agrega precios a los productos → la app muestra el total estimado en tiempo real.

---

## 5. Modelo de Datos

```typescript
interface ShoppingList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  items: ShoppingItem[];
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;           // "kg", "g", "L", "unidad", etc.
  category: string;
  estimatedPrice?: number;
  notes?: string;
  checked: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}
```

---

## 6. Pantallas Requeridas

| Pantalla | Descripción |
|---|---|
| Dashboard | Lista de todas las listas de compras del usuario |
| Detalle de Lista | Vista de productos de una lista, agrupados por categoría |
| Formulario de Producto | Modal/página para agregar o editar un producto |
| Formulario de Lista | Modal para crear o renombrar una lista |
| Vista de Compra | Vista optimizada para usar en el supermercado (modo compra) |

---

## 7. Fuera de Alcance (v1)

- Autenticación de usuarios / cuentas.
- Sincronización en la nube.
- Compartir listas con otros usuarios.
- Historial de compras pasadas.
- Integración con precios reales de supermercados.
