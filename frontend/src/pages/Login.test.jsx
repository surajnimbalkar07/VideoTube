import { render, screen, fireEvent } from "@testing-library/react"
import Login from "./Login"
import { BrowserRouter } from "react-router-dom"
import "@testing-library/jest-dom"
import { vi } from "vitest"

// ✅ FIX: mock lottie (very important)
vi.mock("lottie-react", () => ({
  default: () => <div />
}))

// ✅ fake login function
const mockLogin = vi.fn()

// ✅ mock useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin
  })
}))

// ✅ render helper
const renderPage = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )

// ---------------- TESTS ----------------

// 1. UI test
test("shows login form", () => {
  renderPage()

  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
})

// 2. login test
test("user can login", () => {
  renderPage()

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "test@gmail.com" }
  })

  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "123456" }
  })

  fireEvent.click(screen.getByText("Login"))

  expect(mockLogin).toHaveBeenCalled()
})