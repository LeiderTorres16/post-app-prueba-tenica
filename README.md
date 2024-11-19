Post App - Prueba Técnica
Este proyecto es una aplicación de gestión de publicaciones que permite a los usuarios crear, editar, eliminar y visualizar publicaciones. Se desarrolló como parte de una prueba técnica.

🛠️ Tecnologías Utilizadas
React (v18.3.1) - Biblioteca para construir interfaces de usuario.
Axios - Cliente HTTP para realizar solicitudes a una API.
TailwindCSS - Framework CSS para el diseño.
JSONPlaceholder - API de prueba utilizada como backend para simular datos.
Jest y React Testing Library - Herramientas para pruebas unitarias e integración.

Sitio Web de la Apliacación desplegada: https://prueba-tecnica-crud-articles.netlify.app

📦 Instalación

Clona este repositorio:

git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio


Instala las dependencias:

npm install


Inicia el servidor de desarrollo:

npm start


🚀 Funcionalidades
Crear Publicaciones: Agrega una nueva publicación con título y contenido.
Editar Publicaciones: Modifica los datos de una publicación existente.
Eliminar Publicaciones: Confirma la eliminación de una publicación seleccionada.
Paginación: Visualiza publicaciones en páginas con navegación.
Modal de Confirmación: Confirma acciones críticas como eliminar publicaciones.


🧪 Pruebas
Este proyecto incluye pruebas unitarias y de integración para garantizar el correcto funcionamiento de las funcionalidades principales.

Ejecutar Pruebas
Ejecuta el siguiente comando:

npm test


Para generar un reporte de cobertura:

npm test -- --coverage


📂 Estructura del Proyecto

src/
├── components/
│   ├── PostList.js      // Componente principal para manejar publicaciones
│   ├── PostForm.js      // Formulario para crear/editar publicaciones
│   ├── Modal.js         // Modal para confirmaciones
├── tests/
│   ├── PostList.test.js // Pruebas unitarias para PostList
│   ├── index.test.js    // Pruebas para index.js
├── index.js             // Punto de entrada del proyecto
├── App.js               // Componente raíz
└── index.css            // Estilos principales


📝 Notas
Este proyecto utiliza JSONPlaceholder como API de prueba. Considera implementar una API personalizada para entornos de producción.
Para estilos, se usó TailwindCSS. Puedes personalizarlos en el archivo tailwind.config.js.

🤝 Contribuciones
¡Las contribuciones son bienvenidas! Si encuentras un error o deseas mejorar alguna funcionalidad, por favor, crea un issue o un pull request.


💡 Contacto
Autor: Leider Andres Torres Avila
Correo: leiderandrestorresavila@gmail.com