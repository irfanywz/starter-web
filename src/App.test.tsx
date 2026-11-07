import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "@/App";

describe("App routing", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("menampilkan halaman workspace di route utama", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Workspace" })).toBeInTheDocument();
  });

  it("pindah ke halaman pengaturan saat link diklik", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: "Pengaturan" }));

    expect(await screen.findByRole("heading", { name: "Pengaturan" })).toBeInTheDocument();
  });

  it("pindah ke halaman tentang saat link diklik", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: "Tentang" }));

    expect(await screen.findByRole("heading", { name: "Tentang Aplikasi" })).toBeInTheDocument();
  });

  it("menampilkan halaman 404 untuk route yang tidak ada", () => {
    window.location.hash = "#/tidak-ada";
    render(<App />);

    expect(screen.getByText("Halaman tidak ditemukan")).toBeInTheDocument();
  });
});
