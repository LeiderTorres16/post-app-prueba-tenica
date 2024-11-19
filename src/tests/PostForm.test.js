import { render, screen, fireEvent } from "@testing-library/react";
import PostForm from "../components/PostForm.js";

describe("PostForm Component", () => {
  test("renders form with initial data", () => {
    render(<PostForm initialData={{ title: "Test", body: "Content" }} />);
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Content")).toBeInTheDocument();
  });

  test("calls onSubmit with form data", () => {
    const handleSubmit = jest.fn();
    render(<PostForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "New Title" },
    });
    fireEvent.change(screen.getByLabelText("Contenido"), {
      target: { value: "New Content" },
    });
    fireEvent.click(screen.getByText("Guardar"));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "New Title",
      body: "New Content",
    });
  });
});
