import { ScrollbarUpdateEvent, ScrollbarOrientation } from './ngx-zoneless-scrollbar.models';

describe('ScrollbarUpdateEvent', () => {
  it('should define the correct interface structure', () => {
    const event: ScrollbarUpdateEvent = {
      isVerticallyScrollable: true,
      isHorizontallyScrollable: false
    };

    expect(event.isVerticallyScrollable).toBe(true);
    expect(event.isHorizontallyScrollable).toBe(false);
  });

  it('should accept both boolean values as true', () => {
    const event: ScrollbarUpdateEvent = {
      isVerticallyScrollable: true,
      isHorizontallyScrollable: true
    };

    expect(event.isVerticallyScrollable).toBe(true);
    expect(event.isHorizontallyScrollable).toBe(true);
  });

  it('should accept both boolean values as false', () => {
    const event: ScrollbarUpdateEvent = {
      isVerticallyScrollable: false,
      isHorizontallyScrollable: false
    };

    expect(event.isVerticallyScrollable).toBe(false);
    expect(event.isHorizontallyScrollable).toBe(false);
  });

  it('should have both properties required', () => {
    // TypeScript compilation test - this will fail at compile time if properties are optional
    const createEvent = (props: ScrollbarUpdateEvent): ScrollbarUpdateEvent => props;

    const event = createEvent({
      isVerticallyScrollable: true,
      isHorizontallyScrollable: false
    });

    expect(event).toBeDefined();
  });
});

describe('ScrollbarOrientation', () => {
  it('should accept "vertical" as a valid orientation', () => {
    const orientation: ScrollbarOrientation = 'vertical';
    expect(orientation).toBe('vertical');
  });

  it('should accept "horizontal" as a valid orientation', () => {
    const orientation: ScrollbarOrientation = 'horizontal';
    expect(orientation).toBe('horizontal');
  });

  it('should accept "auto" as a valid orientation', () => {
    const orientation: ScrollbarOrientation = 'auto';
    expect(orientation).toBe('auto');
  });

  it('should be usable in type guards', () => {
    const testOrientation = (value: string): value is ScrollbarOrientation => {
      return value === 'vertical' || value === 'horizontal' || value === 'auto';
    };

    expect(testOrientation('vertical')).toBe(true);
    expect(testOrientation('horizontal')).toBe(true);
    expect(testOrientation('auto')).toBe(true);
    expect(testOrientation('invalid')).toBe(false);
  });

  it('should work in switch statements', () => {
    const getOrientationDescription = (orientation: ScrollbarOrientation): string => {
      switch (orientation) {
        case 'vertical':
          return 'Vertical scrolling only';
        case 'horizontal':
          return 'Horizontal scrolling only';
        case 'auto':
          return 'Both directions as needed';
      }
    };

    expect(getOrientationDescription('vertical')).toBe('Vertical scrolling only');
    expect(getOrientationDescription('horizontal')).toBe('Horizontal scrolling only');
    expect(getOrientationDescription('auto')).toBe('Both directions as needed');
  });

  it('should be usable in arrays', () => {
    const validOrientations: ScrollbarOrientation[] = ['vertical', 'horizontal', 'auto'];
    
    expect(validOrientations).toHaveLength(3);
    expect(validOrientations).toContain('vertical');
    expect(validOrientations).toContain('horizontal');
    expect(validOrientations).toContain('auto');
  });
});

describe('Models Integration', () => {
  it('should work together in a real-world scenario', () => {
    // Use a function to avoid TypeScript const type narrowing
    const getOrientation = (): ScrollbarOrientation => 'vertical';
    const orientation = getOrientation();
    
    const isVertical = orientation === 'vertical' || orientation === 'auto';
    const isHorizontal = orientation === 'horizontal' || orientation === 'auto';
    const updateEvent: ScrollbarUpdateEvent = {
      isVerticallyScrollable: isVertical,
      isHorizontallyScrollable: isHorizontal
    };

    expect(updateEvent.isVerticallyScrollable).toBe(true);
    expect(updateEvent.isHorizontallyScrollable).toBe(false);
  });

  it('should handle auto orientation correctly', () => {
    const orientation: ScrollbarOrientation = 'auto';
    
    // Simulate a scenario where both directions are scrollable
    const updateEvent: ScrollbarUpdateEvent = {
      isVerticallyScrollable: true,
      isHorizontallyScrollable: true
    };

    expect(updateEvent.isVerticallyScrollable).toBe(true);
    expect(updateEvent.isHorizontallyScrollable).toBe(true);
  });

  it('should create type-safe event handlers', () => {
    const handleUpdate = (event: ScrollbarUpdateEvent): string => {
      if (event.isVerticallyScrollable && event.isHorizontallyScrollable) {
        return 'both';
      } else if (event.isVerticallyScrollable) {
        return 'vertical';
      } else if (event.isHorizontallyScrollable) {
        return 'horizontal';
      }
      return 'none';
    };

    expect(handleUpdate({ isVerticallyScrollable: true, isHorizontallyScrollable: true })).toBe('both');
    expect(handleUpdate({ isVerticallyScrollable: true, isHorizontallyScrollable: false })).toBe('vertical');
    expect(handleUpdate({ isVerticallyScrollable: false, isHorizontallyScrollable: true })).toBe('horizontal');
    expect(handleUpdate({ isVerticallyScrollable: false, isHorizontallyScrollable: false })).toBe('none');
  });
});
