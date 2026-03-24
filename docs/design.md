# Design Document - Aplicación de Listas de Compras

## 1. Arquitectura General

Arquitectura desacoplada con backend y frontend deployados de forma independiente.

```
┌─────────────────────┐        ┌──────────────────────────┐
│   Frontend (React)  │  HTTP  │   Backend (Spring Boot)  │
│   Vercel / Netlify  │◄──────►│   Railway / Render / EC2 │
│   puerto: 3000      │  REST  │   puerto: 8080           │
└─────────────────────┘        └──────────────┬───────────┘
                                              │ JDBC
                                   ┌──────────▼───────────┐
                                   │     PostgreSQL        │
                                   │  Railway / Supabase   │
                                   └──────────────────────┘
```

- El frontend consume la API REST del backend vía HTTP.
- CORS configurado en el backend para permitir el origen del frontend.
- Variables de entorno para las URLs de conexión en cada entorno (local, producción).

---

## 2. Stack Tecnológico

### Backend
| Capa | Tecnología | Versión |
|---|---|---|
| Lenguaje | Java | 21 |
| Framework | Spring Boot | 3.x |
| Build | Maven | 3.9+ |
| API | Spring Web (REST) | - |
| Persistencia | Spring Data JPA + Hibernate | - |
| Base de datos | PostgreSQL | 15+ |
| Seguridad | Spring Security + JWT | - |
| Validación | Spring Validation (Bean Validation) | - |
| Documentación API | SpringDoc OpenAPI (Swagger UI) | - |
| Variables de entorno | spring-dotenv o application.properties | - |

### Frontend
| Capa | Tecnología | Versión |
|---|---|---|
| Lenguaje | JavaScript (ES2022+) | - |
| Framework | React | 18 |
| Build | Vite | 5 |
| Estilos | Tailwind CSS | 3 |
| Estado global | Zustand | 4 |
| Routing | React Router | 6 |
| HTTP Client | Axios | - |
| Iconos | Lucide React | - |

---

## 3. Estructura de Proyectos

### Backend (`/backend`)
```
backend/
├── src/main/java/com/shoppinglist/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ListController.java
│   │   └── ItemController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ListService.java
│   │   └── ItemService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ShoppingListRepository.java
│   │   └── ShoppingItemRepository.java
│   ├── model/
│   │   ├── User.java
│   │   ├── ShoppingList.java
│   │   ├── ShoppingItem.java
│   │   └── Category.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   ├── security/
│   │   ├── JwtUtil.java
│   │   └── JwtFilter.java
│   └── ShoppingListApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── application-prod.properties
└── pom.xml
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Button, Input, Modal, Badge, ProgressBar
│   │   ├── lists/        # ListCard, ListForm
│   │   └── items/        # ItemRow, ItemForm
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ListDetail.jsx
│   │   └── ShoppingMode.jsx
│   ├── store/
│   │   └── useShoppingStore.js
│   ├── services/
│   │   ├── api.js        # Instancia Axios con baseURL e interceptores
│   │   ├── authService.js
│   │   ├── listService.js
│   │   └── itemService.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── utils/
│   │   └── categories.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.production
├── vite.config.js
└── package.json
```

---

## 4. Modelo de Datos (Base de Datos)

```sql
-- Usuarios
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Listas de compras
CREATE TABLE shopping_lists (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Items de cada lista
CREATE TABLE shopping_items (
    id               BIGSERIAL PRIMARY KEY,
    list_id          BIGINT REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name             VARCHAR(255) NOT NULL,
    quantity         DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit             VARCHAR(50) DEFAULT 'unidad',
    category         VARCHAR(100),
    estimated_price  DECIMAL(10,2),
    notes            TEXT,
    checked          BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT NOW()
);
```

---

## 5. API REST - Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login, retorna JWT |

### Listas
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/lists` | Obtener todas las listas del usuario |
| POST | `/api/lists` | Crear nueva lista |
| GET | `/api/lists/{id}` | Obtener lista con sus items |
| PUT | `/api/lists/{id}` | Actualizar nombre de lista |
| DELETE | `/api/lists/{id}` | Eliminar lista |
| POST | `/api/lists/{id}/duplicate` | Duplicar lista |

### Items
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/lists/{listId}/items` | Agregar item a lista |
| PUT | `/api/lists/{listId}/items/{itemId}` | Editar item |
| DELETE | `/api/lists/{listId}/items/{itemId}` | Eliminar item |
| PATCH | `/api/lists/{listId}/items/{itemId}/toggle` | Marcar/desmarcar como comprado |
| DELETE | `/api/lists/{listId}/items/checked` | Limpiar items comprados |

### Respuestas estándar
```json
// GET /api/lists
[
  {
    "id": 1,
    "name": "Compra Semanal",
    "totalItems": 12,
    "checkedItems": 8,
    "estimatedTotal": 4500.00,
    "createdAt": "2026-03-22T10:00:00Z"
  }
]

// GET /api/lists/{id}
{
  "id": 1,
  "name": "Compra Semanal",
  "items": [
    {
      "id": 1,
      "name": "Leche",
      "quantity": 2,
      "unit": "L",
      "category": "Lácteos",
      "estimatedPrice": 350.00,
      "notes": null,
      "checked": false
    }
  ]
}
```

---

## 6. Seguridad

- Autenticación con JWT (Bearer token en header `Authorization`).
- Todos los endpoints `/api/**` excepto `/api/auth/**` requieren token válido.
- Cada usuario solo puede acceder a sus propias listas (validación en service layer).
- Passwords hasheados con BCrypt.
- CORS configurado para aceptar solo el origen del frontend en producción.

---

## 7. Configuración por Entorno

### Backend - `application.properties` (local)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shoppinglist
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
jwt.secret=local-secret-key
jwt.expiration=86400000
app.cors.allowed-origins=http://localhost:3000
```

### Backend - `application-prod.properties`
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
jwt.secret=${JWT_SECRET}
app.cors.allowed-origins=${FRONTEND_URL}
```

### Frontend - `.env`
```
VITE_API_URL=http://localhost:8080/api
```

### Frontend - `.env.production`
```
VITE_API_URL=https://tu-backend.railway.app/api
```

---

## 8. Diseño de Pantallas

### Dashboard
```
┌─────────────────────────────────┐
│  🛒 Mis Listas          [+ Nueva]│
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 🛍 Compra Semanal         │  │
│  │ 12 productos · $4,500 est │  │
│  │ ████████░░ 8/12 comprados │  │
│  │              [Editar][🗑] │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Detalle de Lista
```
┌─────────────────────────────────┐
│ ← Compra Semanal    [🛒 Comprar]│
├─────────────────────────────────┤
│ 8/12 productos · $3,200 / $4,500│
│ [+ Agregar producto]            │
├─────────────────────────────────┤
│ 🥛 LÁCTEOS                      │
│  ☐  Leche         2L    $350   │
│  ☑  Yogur         4u    $480   │
├─────────────────────────────────┤
│ 🥩 CARNES                       │
│  ☐  Pollo         1kg   $1,200 │
└─────────────────────────────────┘
```

### Modo Compra
```
┌─────────────────────────────────┐
│ ← Compra Semanal                │
│         8 / 12 ✓                │
│ ████████████░░░░░░░░  67%       │
├─────────────────────────────────┤
│ [Solo pendientes] [Todos]       │
├─────────────────────────────────┤
│ 🥛 LÁCTEOS                      │
│  ○  Leche          2L   $350   │
│  ✓  ~~Yogur~~      4u   $480   │
└─────────────────────────────────┘
```

---

## 9. Flujo de Navegación

```
/login              → Login / Registro
/                   → Dashboard (listas del usuario)
/lists/:id          → Detalle de lista con items
/lists/:id/shopping → Modo compra
```

Rutas protegidas: todas excepto `/login`. Si no hay JWT válido, redirige a `/login`.

---

## 10. Deploy

### Backend → Railway / Render
- Dockerfile o deploy directo desde GitHub.
- Variables de entorno configuradas en el panel del servicio.
- PostgreSQL como servicio adicional en Railway, o Supabase.

### Frontend → Vercel / Netlify
- Deploy automático desde GitHub en cada push a `main`.
- Variable `VITE_API_URL` configurada en el panel del servicio.
- Build command: `npm run build` / Output dir: `dist`.

---

## 11. Plan de Implementación

| Fase | Tareas | Prioridad |
|---|---|---|
| 1 - Setup | Proyectos Maven + Vite, DB local, CORS | Alta |
| 2 - Auth | Register/Login backend + JWT + pantalla Login frontend | Alta |
| 3 - Listas | CRUD listas backend + Dashboard frontend | Alta |
| 4 - Items | CRUD items backend + ListDetail frontend | Alta |
| 5 - Modo Compra | Toggle checked + ShoppingMode frontend | Alta |
| 6 - Presupuesto | Cálculo totales en backend + display frontend | Media |
| 7 - Deploy | Configurar Railway + Vercel, variables de entorno | Alta |
| 8 - Polish | Empty states, confirmaciones, animaciones | Baja |
