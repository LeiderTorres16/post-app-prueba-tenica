import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../components/Modal.js";

describe("Modal Component", () => {
  test("renders modal with title and message", () => {
    const handleClose = jest.fn();
    render(
      <Modal
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onClose={handleClose}
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cerrar"));
    expect(handleClose).toHaveBeenCalled();
  });

  test("does not render modal when closed", () => {
    render(<Modal isOpen={false} />);
    expect(screen.queryByText("Cerrar")).toBeNull();
  });
});
