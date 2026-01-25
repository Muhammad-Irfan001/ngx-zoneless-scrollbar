/**
 * Event emitted when scrollbar state is updated
 */
export interface ScrollbarUpdateEvent {
  /** Whether content is vertically scrollable */
  isVerticallyScrollable: boolean;
  /** Whether content is horizontally scrollable */
  isHorizontallyScrollable: boolean;
}

/**
 * Orientation options for the scrollbar
 */
export type ScrollbarOrientation = 'vertical' | 'horizontal' | 'auto';
