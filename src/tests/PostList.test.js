import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import PostList from "../components/PostList";

jest.mock("axios");

describe("PostList Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: "First Post", body: "Body of first post" },
        { id: 2, title: "Second Post", body: "Body of second post" },
      ],
    });
  });

  test("fetches and displays posts", async () => {
    render(<PostList />);

    // Espera que los posts se carguen y aparezcan en la tabla
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
    });
  });

  test("handles create post functionality", async () => {
    axios.post.mockResolvedValue({
      data: { id: 3, title: "New Post" },
    });

    render(<PostList />);

    fireEvent.click(screen.getByText("Crear Post"));

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "New Post" },
    });
    fireEvent.change(screen.getByLabelText("Contenido"), {
      target: { value: "Content of the new post" },
    });

    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("New Post")).toBeInTheDocument();
    });
  });

  test("handles edit post functionality", async () => {
    axios.put.mockResolvedValue({
      data: { id: 1, title: "Updated Post", body: "Updated content" },
    });
  
    render(<PostList />);
  
    // Esperar que los posts se carguen
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  
    // Click en el botón "Editar" del primer post
    fireEvent.click(screen.getAllByText("Editar")[0]); // Selecciona el primer botón "Editar"
  
    // Cambiar el título
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Updated Post" },
    });
  
    // Cambiar el contenido
    fireEvent.change(screen.getByLabelText("Contenido"), {
      target: { value: "Updated content" },
    });
  
    // Guardar los cambios
    fireEvent.click(screen.getByText("Guardar"));
  
    // Verificar que los cambios se reflejen en la tabla
    await waitFor(() => {
      expect(screen.getByText("Updated Post")).toBeInTheDocument();
    });
  });

  test("handles delete post functionality", async () => {
    axios.delete.mockResolvedValue({});

    render(<PostList />);

    // Esperar que los posts iniciales carguen
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
    });

    // Click en el botón "Eliminar" del primer post
    fireEvent.click(screen.getAllByText("Eliminar")[0]);

    // Confirmar la eliminación en el modal
    fireEvent.click(screen.getByText("Confirmar"));

    // Esperar que el post eliminado ya no esté en la tabla
    await waitFor(() => {
      expect(screen.queryByText("First Post")).toBeNull();
    });
  });

  test("handles error when fetching posts", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching posts"));
  
    render(<PostList />);
  
    await waitFor(() => {
      expect(screen.queryByText("First Post")).toBeNull();
    });
  });

  test("renders empty state when no posts are available", async () => {
    axios.get.mockResolvedValue({ data: [] });
  
    render(<PostList />);
  
    await waitFor(() => {
      expect(screen.getByText("Página 1 de 0")).toBeInTheDocument();
    });
  });

  test("handles pagination correctly", async () => {
    axios.get.mockResolvedValue({
      data: [
        ...Array(15).keys(), // Simula 15 posts
      ].map((i) => ({ id: i + 1, title: `Post ${i + 1}` })),
    });
  
    render(<PostList />);
  
    // Verifica que la primera página se carga
    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Post 10")).toBeInTheDocument();
    });
  
    // Cambia a la segunda página
    fireEvent.click(screen.getByText("Siguiente"));
  
    await waitFor(() => {
      expect(screen.getByText("Post 11")).toBeInTheDocument();
      expect(screen.getByText("Post 15")).toBeInTheDocument();
    });
  });
  
  test("handles error when creating a post", async () => {
    axios.post.mockRejectedValue(new Error("Error creating post"));
  
    render(<PostList />);
  
    fireEvent.click(screen.getByText("Crear Post"));
  
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "New Post" },
    });
    fireEvent.change(screen.getByLabelText("Contenido"), {
      target: { value: "Content of the new post" },
    });
  
    fireEvent.click(screen.getByText("Guardar"));
  
    // Esperar que el error sea manejado
    await waitFor(() => {
      expect(screen.queryByText("New Post")).toBeNull();
    });
  });

  test("handles error when deleting a post", async () => {
    axios.delete.mockRejectedValue(new Error("Error deleting post"));

    render(<PostList />);

    // Esperar que los posts se carguen
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });

    // Click en el botón "Eliminar" del primer post
    fireEvent.click(screen.getAllByText("Eliminar")[0]);

    // Confirmar la eliminación en el modal
    fireEvent.click(screen.getByText("Confirmar"));

    // Esperar que el error sea manejado (el post sigue visible)
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  });

  test("handles error when editing a post", async () => {
    axios.put.mockRejectedValue(new Error("Error editing post"));
  
    render(<PostList />);
  
    // Esperar que los posts se carguen
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  
    // Click en el botón "Editar" del primer post
    fireEvent.click(screen.getAllByText("Editar")[0]);
  
    // Cambiar el título
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Updated Post" },
    });
  
    // Intentar guardar los cambios
    fireEvent.click(screen.getByText("Guardar"));
  
    // Esperar que el error sea manejado (el post original sigue visible)
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  });

  test("displays the edit form when editing a post", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, title: "First Post", body: "Body of first post" }],
    });
  
    render(<PostList />);
  
    // Esperar que el post cargue
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  
    // Click en el botón "Editar"
    fireEvent.click(screen.getAllByText("Editar")[0]);
  
    // Verificar que el formulario de edición aparece
    expect(screen.getByText("Editar Post")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toHaveValue("First Post");
  });

  test("hides the edit form when cancelling edit", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, title: "First Post", body: "Body of first post" }],
    });
  
    render(<PostList />);
  
    // Esperar que el post cargue
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  
    // Click en el botón "Editar"
    fireEvent.click(screen.getAllByText("Editar")[0]);
  
    // Verificar que el formulario de edición aparece
    expect(screen.getByText("Editar Post")).toBeInTheDocument();
  
    // Click en "Cancelar"
    fireEvent.click(screen.getByText("Cancelar"));
  
    // Verificar que el formulario desaparece
    expect(screen.queryByText("Editar Post")).toBeNull();
  });
  
  test("does not navigate before the first page", async () => {
    axios.get.mockResolvedValue({
      data: Array(15).fill(null).map((_, i) => ({ id: i + 1, title: `Post ${i + 1}` })),
    });
  
    render(<PostList />);
  
    // Verificar que estamos en la primera página
    await waitFor(() => {
      expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    });
  
    // Intentar ir a la página anterior
    fireEvent.click(screen.getByText("Anterior"));
  
    // Verificar que no cambia la página
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
  });
  
  test("closes the modal without performing any action", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, title: "First Post" }],
    });
  
    render(<PostList />);
  
    // Esperar que el post cargue
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });
  
    // Click en el botón "Eliminar"
    fireEvent.click(screen.getByText("Eliminar"));
  
    // Verificar que el modal aparece
    expect(screen.getByText("¿Estás seguro de que deseas eliminar este post?")).toBeInTheDocument();
  
    // Click en "Cerrar"
    fireEvent.click(screen.getByText("Cerrar"));
  
    // Verificar que el modal desaparece
    expect(screen.queryByText("¿Estás seguro de que deseas eliminar este post?")).toBeNull();
  });

  test("disables the previous button on the first page and navigates correctly", async () => {
    axios.get.mockResolvedValue({
      data: Array(15).fill(null).map((_, i) => ({ id: i + 1, title: `Post ${i + 1}` })),
    });
  
    render(<PostList />);
  
    // Verificar que el botón "Anterior" está deshabilitado en la primera página
    await waitFor(() => {
      expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    });
    expect(screen.getByText("Anterior")).toBeDisabled();
  
    // Navegar a la segunda página
    fireEvent.click(screen.getByText("Siguiente"));
    await waitFor(() => {
      expect(screen.getByText("Página 2 de 2")).toBeInTheDocument();
    });
  
    // Verificar que el botón "Anterior" ahora está habilitado
    expect(screen.getByText("Anterior")).not.toBeDisabled();
  
    // Navegar de vuelta a la primera página
    fireEvent.click(screen.getByText("Anterior"));
    await waitFor(() => {
      expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    });
  });
  
  test("shows and hides the create form correctly", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, title: "First Post", body: "Body of first post" }],
    });
  
    render(<PostList />);
  
    // Verificar que el botón "Crear Post" está visible
    expect(screen.getByText("Crear Post")).toBeInTheDocument();
  
    // Click en el botón "Crear Post"
    fireEvent.click(screen.getByText("Crear Post"));
  
    // Verificar que el formulario de creación aparece
    expect(screen.getByText("Crear Nuevo Post")).toBeInTheDocument();
  
    // Click en "Cancelar" dentro del formulario
    fireEvent.click(screen.getByText("Cancelar"));
  
    // Verificar que el formulario de creación desaparece
    expect(screen.queryByText("Crear Nuevo Post")).toBeNull();
  });
  

});
