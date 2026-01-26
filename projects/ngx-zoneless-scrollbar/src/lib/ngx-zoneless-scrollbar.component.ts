import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, OnDestroy, output, signal, ViewChild, WritableSignal } from '@angular/core';
import { ScrollbarOrientation, ScrollbarUpdateEvent } from './ngx-zoneless-scrollbar.models';

/**
 * NgxZonelessScrollbar
 *
 * A lightweight, zoneless-compatible scrollbar component for Angular.
 * Uses native browser scrolling with CSS-styled scrollbars.
 *
 * Features:
 * - Uses native browser scrolling (100% reliable in zoneless mode)
 * - CSS-styled scrollbars for modern browsers (Chrome, Firefox, Safari)
 * - Detects if content is scrollable and exposes this via signals
 * - Emits events after content updates
 * - Touch-friendly with momentum scrolling
 *
 * @example
 * ```html
 * <ngx-zoneless-scrollbar (afterUpdate)="onScrollbarUpdated($event)">
 *   <div>Your scrollable content here</div>
 * </ngx-zoneless-scrollbar>
 * ```
 */
@Component({
  selector: 'ngx-zoneless-scrollbar',
  standalone: true,
  template: `
    <div #viewport class="ngx-zoneless-scrollbar-viewport" [class.vertical-scrollable]="isVerticallyScrollable()" [class.horizontal-scrollable]="isHorizontallyScrollable()">
      <div #content class="ngx-zoneless-scrollbar-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
        position: relative;

        /* CSS Custom Properties for easy customization */
        --scrollbar-size: 7px;
        --scrollbar-track-color: transparent;
        --scrollbar-track-radius: 4px;
        --scrollbar-thumb-color: rgba(0, 0, 0, 0.3);
        --scrollbar-thumb-color-hover: rgba(0, 0, 0, 0.5);
        --scrollbar-thumb-radius: 4px;
        --scrollbar-thumb-shadow: none;
        --scrollbar-thumb-shadow-hover: none;
        --scrollbar-thumb-border: none;
        --scrollbar-thumb-border-hover: none;
      }

      .ngx-zoneless-scrollbar-viewport {
        height: 100%;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        overscroll-behavior: contain; /* Prevent scroll chaining */

        /* Firefox scrollbar styling */
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
      }

      /* Custom scrollbar styling for webkit browsers (Chrome, Safari, Edge) */
      .ngx-zoneless-scrollbar-viewport::-webkit-scrollbar {
        width: var(--scrollbar-size);
        height: var(--scrollbar-size);
      }

      .ngx-zoneless-scrollbar-viewport::-webkit-scrollbar-track {
        background: var(--scrollbar-track-color);
        border-radius: var(--scrollbar-track-radius);
      }

      .ngx-zoneless-scrollbar-viewport::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb-color);
        border-radius: var(--scrollbar-thumb-radius);
        border: var(--scrollbar-thumb-border);
        box-shadow: var(--scrollbar-thumb-shadow);
        transition: background 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
      }

      .ngx-zoneless-scrollbar-viewport::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb-color-hover);
        border: var(--scrollbar-thumb-border-hover);
        box-shadow: var(--scrollbar-thumb-shadow-hover);
      }

      /* Orientation-specific overflow behavior */
      :host([orientation='vertical']) .ngx-zoneless-scrollbar-viewport {
        overflow-x: hidden;
        overflow-y: auto;
      }

      :host([orientation='horizontal']) .ngx-zoneless-scrollbar-viewport {
        overflow-x: auto;
        overflow-y: hidden;
      }

      .ngx-zoneless-scrollbar-content {
        min-height: 100%;
        min-width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.orientation]': 'orientation()',
  },
})
export class NgxZonelessScrollbar implements AfterViewInit, OnDestroy {
  @ViewChild('viewport') viewportRef!: ElementRef<HTMLElement>;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  /**
   * Orientation of scrolling
   * - 'vertical': Only vertical scrolling (default)
   * - 'horizontal': Only horizontal scrolling
   * - 'auto': Both directions as needed
   */
  readonly orientation = input<ScrollbarOrientation>('vertical');

  /**
   * Emits after the scrollbar state is updated with scrollability info
   */
  readonly afterUpdate = output<ScrollbarUpdateEvent>();

  /**
   * Signal indicating if content is vertically scrollable
   */
  readonly isVerticallyScrollable: WritableSignal<boolean> = signal(false);

  /**
   * Signal indicating if content is horizontally scrollable
   */
  readonly isHorizontallyScrollable: WritableSignal<boolean> = signal(false);

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    // Initial check after view is ready
    this.checkScrollability();

    // Set up ResizeObserver to detect content changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkScrollability();
      });

      // Observe both viewport and content for size changes
      this.resizeObserver.observe(this.viewportRef.nativeElement);
      this.resizeObserver.observe(this.contentRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  /**
   * Check if content is scrollable and emit update event
   */
  private checkScrollability(): void {
    const viewport = this.viewportRef?.nativeElement;
    const content = this.contentRef?.nativeElement;

    if (!viewport || !content) return;

    const isVertical = content.scrollHeight > viewport.clientHeight;
    const isHorizontal = content.scrollWidth > viewport.clientWidth;

    // Only update and emit if values changed
    const prevVertical = this.isVerticallyScrollable();
    const prevHorizontal = this.isHorizontallyScrollable();

    if (isVertical !== prevVertical || isHorizontal !== prevHorizontal) {
      this.isVerticallyScrollable.set(isVertical);
      this.isHorizontallyScrollable.set(isHorizontal);

      this.afterUpdate.emit({
        isVerticallyScrollable: isVertical,
        isHorizontallyScrollable: isHorizontal,
      });
    }
  }

  /**
   * Scroll to a specific position
   * @param options - ScrollToOptions with top, left, and behavior
   * @returns Promise that resolves when scroll is complete
   */
  scrollTo(options: ScrollToOptions): Promise<void> {
    return new Promise((resolve) => {
      this.viewportRef?.nativeElement?.scrollTo({
        top: options.top ?? 0,
        left: options.left ?? 0,
        behavior: options.behavior ?? 'smooth',
      });
      // Resolve after a short delay for smooth scroll
      setTimeout(resolve, options.behavior === 'instant' ? 0 : 300);
    });
  }

  /**
   * Manually trigger an update check
   */
  update(): void {
    this.checkScrollability();
  }

  /**
   * Get the viewport element for direct access if needed
   */
  get viewportElement(): HTMLElement | null {
    return this.viewportRef?.nativeElement ?? null;
  }

  /**
   * Get the current scroll position
   */
  get scrollTop(): number {
    return this.viewportRef?.nativeElement?.scrollTop ?? 0;
  }

  /**
   * Get the current horizontal scroll position
   */
  get scrollLeft(): number {
    return this.viewportRef?.nativeElement?.scrollLeft ?? 0;
  }
}
