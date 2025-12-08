import Login from "@/app/login/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/navigation";
require("@testing-library/jest-dom");

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock alert & localStorage
global.alert = jest.fn();
Storage.prototype.setItem = jest.fn();
Storage.prototype.removeItem = jest.fn();

describe("Login Component", () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    jest.clearAllMocks();
  });

  test("renders email + password fields", () => {
    render(<Login />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  test("shows error if login clicked with empty fields", async () => {
    render(<Login />);

    fireEvent.click(screen.getByText("Login"));

    expect(
      await screen.findByText("Please fill all fields.")
    ).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const toggleBtn = screen.getAllByRole("button")[0];

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("password");
  });

  test("successful login shows success message", async () => {
    axios.post.mockResolvedValue({ data: { token: "abc123" } });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(axios.post).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(screen.getByText("Logged in successfully!")).toBeInTheDocument()
    );

    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  test("failed login shows invalid message", async () => {
    axios.post.mockRejectedValue({
      response: { status: 404 },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(axios.post).toHaveBeenCalledTimes(1);

    expect(
      await screen.findByText("Invalid password or email.")
    ).toBeInTheDocument();
  });
});
