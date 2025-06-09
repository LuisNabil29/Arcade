# 🎮 Arcade - Plataforma de Juegos Clásicos

Una plataforma web moderna que reúne cinco juegos arcade clásicos en una experiencia nostálgica y atractiva.

![Arcade Platform](https://img.shields.io/badge/Status-Fase%201%20Completada-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## 🕹️ Juegos Incluidos

- **🧩 Tetris** - El clásico juego de bloques que caen
- **🐍 Viborita (Snake)** - Controla la serpiente para comer y crecer
- **👻 Pac-Man** - Navega por el laberinto evitando fantasmas
- **🚀 Galaga** - Shooter espacial clásico
- **⚡ Pinball** - Simulador de máquina de pinball

## ✨ Características

### 🎨 Estética Arcade Auténtica
- **Colores neón** sobre fondo oscuro
- **Tipografía pixelada** (Orbitron)
- **Animaciones sutiles** y efectos hover
- **Efectos de brillo** y sombras neón

### 📱 Diseño Responsive
- **Grid adaptativo** que funciona en todos los dispositivos
- **Optimizado para móviles** con controles táctiles preparados
- **Experiencia fluida** en desktop, tablet y móvil

### 🏗️ Arquitectura Moderna
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **React Router** para navegación fluida
- **Componentes reutilizables** y escalables
- **CSS modular** con variables personalizadas

## 🚀 Estado del Proyecto

### ✅ Fase 1 - Completada
- [x] Página principal con hero section
- [x] Grid de 5 tarjetas de juegos
- [x] Placeholders para todos los juegos
- [x] Navegación completa entre páginas
- [x] Estética arcade implementada
- [x] Diseño responsive

### 🔄 Fase 2 - En Planificación
- [ ] Implementación de Tetris
- [ ] Implementación de Snake
- [ ] Implementación de Pac-Man
- [ ] Implementación de Galaga
- [ ] Implementación de Pinball

### 🎯 Fase 3 - Futuro
- [ ] Sistema de audio (efectos y música)
- [ ] Persistencia de puntuaciones
- [ ] Características PWA
- [ ] Optimizaciones avanzadas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS Modules + Variables CSS
- **Fonts**: Google Fonts (Orbitron)
- **Icons**: Emojis nativos

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/LuisNabil29/Arcade.git

# Navegar al directorio
cd Arcade

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 📁 Estructura del Proyecto

```
arcade/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── HomePage.tsx     # Página principal
│   │   ├── GameGrid.tsx     # Grid de juegos
│   │   ├── GameCard.tsx     # Tarjeta individual
│   │   └── GamePlaceholder.tsx # Placeholder genérico
│   ├── games/              # Páginas de juegos
│   │   ├── tetris/
│   │   ├── snake/
│   │   ├── pacman/
│   │   ├── galaga/
│   │   └── pinball/
│   ├── styles/             # Estilos globales
│   │   └── globals.css
│   └── App.tsx            # Componente principal
├── memory-bank/           # Documentación del proyecto
├── public/               # Assets estáticos
└── package.json
```

## 🎨 Paleta de Colores

- **Cyan Neón**: `#00ffff` - Tetris
- **Verde Neón**: `#00ff00` - Snake  
- **Amarillo Neón**: `#ffff00` - Pac-Man
- **Magenta Neón**: `#ff00ff` - Galaga
- **Naranja Neón**: `#ff8000` - Pinball

## 📖 Documentación

El proyecto incluye un **Memory Bank** completo con documentación detallada:

- `projectBrief.md` - Visión y requerimientos
- `activeContext.md` - Contexto actual y próximos pasos
- `progress.md` - Estado de desarrollo y milestones
- `techContext.md` - Stack tecnológico y decisiones
- `systemPatterns.md` - Arquitectura y patrones
- `productContext.md` - UX y contexto de producto

## 🤝 Contribución

Este es un proyecto personal de aprendizaje, pero las sugerencias y feedback son bienvenidos.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🎯 Roadmap

1. **Q1 2025**: Implementación de Tetris y Snake
2. **Q2 2025**: Implementación de Pac-Man y Galaga  
3. **Q3 2025**: Implementación de Pinball
4. **Q4 2025**: Características avanzadas y PWA

---

**Hecho con ❤️ para los amantes de los juegos retro**

🔗 **Demo**: [Próximamente]  
🐛 **Issues**: [GitHub Issues](https://github.com/LuisNabil29/Arcade/issues)  
⭐ **Star** este repo si te gusta el proyecto!
