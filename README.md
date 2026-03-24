# Listas de Compras

Aplicación full-stack para gestionar listas de compras del supermercado.

## Requisitos

- Java 21
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+

## Setup local

### 1. Base de datos

```sql
CREATE DATABASE shoppinglist;
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Corre en `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:3000`

## Variables de entorno

### Backend (`application.properties`)
```
spring.datasource.url=jdbc:postgresql://localhost:5432/shoppinglist
spring.datasource.username=postgres
spring.datasource.password=postgres
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8080/api
```

## Deploy

- Backend → Railway / Render (activar perfil `prod` con `-Dspring.profiles.active=prod`)
- Frontend → Vercel / Netlify (configurar `VITE_API_URL` en el panel)
- DB → Railway PostgreSQL o Supabase
