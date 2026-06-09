// ABOUTME: Integration test for the Home route — verifies the homepage sections render.
// ABOUTME: Copy-specific assertions live in the component tests and the homepage e2e.
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

describe('Home', () => {
  it('renders the homepage sections', () => {
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>);
    expect(container.querySelectorAll('.section').length).toBeGreaterThan(0);
  });
});
