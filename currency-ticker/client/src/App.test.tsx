import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect } from 'vitest';

describe("Currency Ticker App", () => {
  it('renders the App component', () => {
    render(<App />);
    const linkElement = screen.getByText(/Currency Ticker/i);
    expect(linkElement).not.toBeNull();
  });
});
