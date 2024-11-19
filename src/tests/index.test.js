import React from "react";
import App from "../App";

jest.mock("react-dom/client", () => {
  const mockRender = jest.fn();
  const mockCreateRoot = jest.fn(() => ({
    render: mockRender,
  }));
  return {
    createRoot: mockCreateRoot,
  };
});

test("renders App without crashing", () => {
  // Crear un nodo raíz simulado
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);

  // Importar `index.js` después de configurar el mock
  require("../index");

  // Obtener el mock desde el módulo
  const { createRoot } = require("react-dom/client");

  // Verificar que `createRoot` se llamó con el nodo raíz correcto
  expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));

  // Verificar que `render` se llamó con el árbol de React correcto
  expect(createRoot().render).toHaveBeenCalledWith(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
