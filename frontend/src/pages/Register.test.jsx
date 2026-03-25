import { render, screen, fireEvent } from "@testing-library/react"
import Register from "./Register"
import { BrowserRouter } from "react-router-dom"
import "@testing-library/jest-dom"
import { vi } from "vitest"

// ✅ fake register function
const mockRegister = vi.fn()

// ✅ mock useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    register: mockRegister
  })
}))

// ✅ mock navigate
const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// ✅ render helper
const renderPage = () =>
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  )

// ---------------- TESTS ----------------

describe("Register Component", () => {

  // 🔹 1. UI test
  test("renders register form", () => {
    renderPage()

    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByText("Register")).toBeInTheDocument()
  })

  // 🔹 2. submit test
  test("user can register", () => {
    renderPage()

    // fill inputs
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Suraj" }
    })

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "suraj123" }
    })

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "suraj@gmail.com" }
    })

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" }
    })

    // ✅ file input fix
    const file = new File(["dummy"], "avatar.png", { type: "image/png" })
    const fileInput = document.querySelector('input[type="file"]')

    fireEvent.change(fileInput, {
      target: { files: [file] }
    })

    // ✅ submit form directly (important fix)
    fireEvent.submit(document.querySelector("form"))

    // ✅ check register called
    expect(mockRegister).toHaveBeenCalled()
  })

})