/**
 * FloorPlan Component Tests
 * Story 2.1: Interactive SVG Floor Plan Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloorPlan } from './FloorPlan';
import type { Floor, Space } from '@/types/space';

const mockFloor: Floor = {
  id: 'floor-1',
  name: 'Floor 1',
  svgPath: '/assets/floor-plans/floor-1.svg',
  building: 'Main Building',
};

const mockSpaces: Space[] = [
  {
    id: 'space-1',
    name: 'Study Room 101',
    type: 'Study Room',
    capacity: 4,
    equipment: ['Whiteboard', 'Computer'],
    floorId: 'floor-1',
  },
  {
    id: 'space-2',
    name: 'Group Room 102',
    type: 'Group Room',
    capacity: 8,
    equipment: ['Projector', 'TV'],
    floorId: 'floor-1',
  },
];

describe('FloorPlan', () => {
  it('renders floor plan with SVG', () => {
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} />);

    const svg = screen.getByRole('img', { hidden: true }) || document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders all spaces as SVG paths', () => {
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} />);

    const paths = document.querySelectorAll('.space-path');
    expect(paths.length).toBe(mockSpaces.length);
  });

  it('renders zoom controls', () => {
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} />);

    // Zoom controls should be present
    const zoomControls = document.querySelector('.zoom-controls');
    expect(zoomControls).toBeTruthy();
  });

  it('shows tooltip on space hover', async () => {
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} />);

    const spacePath = document.querySelector(`#space-${mockSpaces[0].id}`) as SVGPathElement;
    expect(spacePath).toBeTruthy();

    // Simulate hover
    fireEvent.mouseEnter(spacePath, { clientX: 100, clientY: 100 });

    // Tooltip should appear with space name
    const tooltip = await screen.findByText(mockSpaces[0].name);
    expect(tooltip).toBeTruthy();
  });

  it('hides tooltip on mouse leave', () => {
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} />);

    const spacePath = document.querySelector(`#space-${mockSpaces[0].id}`) as SVGPathElement;

    // Hover then leave
    fireEvent.mouseEnter(spacePath, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(spacePath);

    // Tooltip should not be visible
    const tooltip = document.querySelector('.space-tooltip');
    if (tooltip) {
      expect(tooltip.textContent).not.toContain(mockSpaces[0].name);
    }
  });

  it('calls onSpaceClick when space is clicked', () => {
    const handleClick = vi.fn();
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} onSpaceClick={handleClick} />);

    const spacePath = document.querySelector(`#space-${mockSpaces[0].id}`) as SVGPathElement;
    fireEvent.click(spacePath);

    expect(handleClick).toHaveBeenCalledWith(mockSpaces[0]);
  });

  it('highlights selected space', () => {
    render(
      <FloorPlan
        floor={mockFloor}
        spaces={mockSpaces}
        selectedSpace={mockSpaces[0]}
      />
    );

    const selectedPath = document.querySelector(`#space-${mockSpaces[0].id}`) as SVGPathElement;
    const fill = selectedPath.getAttribute('fill');

    // Selected space should have blue fill
    expect(fill).toContain('3b82f6'); // blue-600
  });

  it('renders space labels', () => {
    render(<FloorPlan floor={mockFloor} spaces={mockSpaces} />);

    // Check for space name labels in SVG text elements
    const svgTexts = document.querySelectorAll('svg text');
    const labelTexts = Array.from(svgTexts).map((el) => el.textContent);

    mockSpaces.forEach((space) => {
      expect(labelTexts).toContain(space.name);
    });
  });
});
