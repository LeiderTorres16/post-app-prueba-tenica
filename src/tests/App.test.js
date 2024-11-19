import { render, screen } from "@testing-library/react";
import App from "../App.js";

describe("App Component", () => {
  test("renders App with header and PostList", () => {
    render(<App />);
    expect(
      screen.getByText("Blog App con React y Tailwind CSS")
    ).toBeInTheDocument();
  });
});
