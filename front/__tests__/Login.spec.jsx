import Login from "@/app/login/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/navigation";
require("@testing-library/jest-dom");

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/components/GoogleBtn", () => ({
  __esModule: true,
  default: ({ label }) => <button>{label}</button>,
}));

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
    expect(screen.getByText("И-мэйл хаяг")).toBeInTheDocument();
    expect(screen.getByText("Нууц үг")).toBeInTheDocument();
  });

  test("shows error if login clicked with empty fields", async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: "Нэвтрэх" }));

    expect(
      await screen.findByText("Бүх талбарыг бөглөнө үү."),
    ).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText(
      "Энд нууц үгээ оруулна уу",
    );

    const toggleBtn = passwordInput.parentElement.querySelector("button");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("successful login shows success message", async () => {
    axios.post.mockResolvedValue({ data: { token: "abc123" } });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Энд и-мэйлээ оруулна уу"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Энд нууц үгээ оруулна уу"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Нэвтрэх" }));

    expect(axios.post).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(screen.getByText("Амжилттай нэвтэрлээ!")).toBeInTheDocument(),
    );

    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  test("failed login shows invalid message", async () => {
    axios.post.mockRejectedValue({ response: { status: 404 } });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Энд и-мэйлээ оруулна уу"), {
      target: { value: "wrong@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Энд нууц үгээ оруулна уу"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Нэвтрэх" }));

    expect(axios.post).toHaveBeenCalledTimes(1);

    expect(
      await screen.findByText("Нууц үг эсвэл и-мэйл буруу байна."),
    ).toBeInTheDocument();
  });
});
