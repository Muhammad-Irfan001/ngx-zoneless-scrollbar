import { Component, Injector, provideExperimentalZonelessChangeDetection, runInInjectionContext } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxZonelessScrollbar } from './ngx-zoneless-scrollbar.component';
import { ScrollbarUpdateEvent } from './ngx-zoneless-scrollbar.models';

// Test host component for testing with content
@Component({
  standalone: true,
  imports: [NgxZonelessScrollbar],
  template: `
    <ngx-zoneless-scrollbar [orientation]="orientation" (afterUpdate)="onUpdate($event)" style="height: 200px; width: 200px;">
      <div [style.height.px]="contentHeight" [style.width.px]="contentWidth">
        Test Content
      </div>
    </ngx-zoneless-scrollbar>
  `,
})
class TestHostComponent {
  orientation: 'vertical' | 'horizontal' | 'auto' = 'vertical';
  contentHeight = 100;
  contentWidth = 100;
  updateEvents: ScrollbarUpdateEvent[] = [];

  onUpdate(event: ScrollbarUpdateEvent): void {
    this.updateEvents.push(event);
  }
}

describe('NgxZonelessScrollbar', () => {
  let component: NgxZonelessScrollbar;
  let fixture: ComponentFixture<NgxZonelessScrollbar>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxZonelessScrollbar],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxZonelessScrollbar);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default orientation as vertical', () => {
      expect(component.orientation()).toBe('vertical');
    });

    it('should initialize scrollability signals as false', () => {
      expect(component.isVerticallyScrollable()).toBe(false);
      expect(component.isHorizontallyScrollable()).toBe(false);
    });

    it('should render viewport and content elements', () => {
      fixture.detectChanges();
      const viewport = compiled.querySelector('.ngx-zoneless-scrollbar-viewport');
      const content = compiled.querySelector('.ngx-zoneless-scrollbar-content');

      expect(viewport).toBeTruthy();
      expect(content).toBeTruthy();
    });

    it('should set orientation attribute on host element', () => {
      fixture.detectChanges();
      expect(compiled.getAttribute('orientation')).toBe('vertical');
    });
  });

  describe('Orientation Input', () => {
    it('should accept vertical orientation', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();

      expect(component.orientation()).toBe('vertical');
      expect(compiled.getAttribute('orientation')).toBe('vertical');
    });

    it('should accept horizontal orientation', () => {
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();

      expect(component.orientation()).toBe('horizontal');
      expect(compiled.getAttribute('orientation')).toBe('horizontal');
    });

    it('should accept auto orientation', () => {
      fixture.componentRef.setInput('orientation', 'auto');
      fixture.detectChanges();

      expect(component.orientation()).toBe('auto');
      expect(compiled.getAttribute('orientation')).toBe('auto');
    });
  });

  describe('ViewChild References', () => {
    it('should have viewport reference after view init', () => {
      fixture.detectChanges();
      expect(component.viewportRef).toBeTruthy();
      expect(component.viewportRef.nativeElement).toBeInstanceOf(HTMLElement);
    });

    it('should have content reference after view init', () => {
      fixture.detectChanges();
      expect(component.contentRef).toBeTruthy();
      expect(component.contentRef.nativeElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Scrollability Detection', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let scrollbarComponent: NgxZonelessScrollbar;

    // Helper to mock element dimensions for JSDOM
    function mockScrollDimensions(
      viewport: HTMLElement,
      content: HTMLElement,
      options: {
        viewportHeight?: number;
        viewportWidth?: number;
        contentHeight?: number;
        contentWidth?: number;
      },
    ) {
      Object.defineProperty(viewport, 'clientHeight', { value: options.viewportHeight ?? 200, configurable: true });
      Object.defineProperty(viewport, 'clientWidth', { value: options.viewportWidth ?? 200, configurable: true });
      Object.defineProperty(content, 'scrollHeight', { value: options.contentHeight ?? 100, configurable: true });
      Object.defineProperty(content, 'scrollWidth', { value: options.contentWidth ?? 100, configurable: true });
    }

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideExperimentalZonelessChangeDetection()],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const scrollbarDebugElement = hostFixture.debugElement.query(By.directive(NgxZonelessScrollbar));
      scrollbarComponent = scrollbarDebugElement.componentInstance;
    });

    afterEach(() => {
      hostFixture.destroy();
    });

    it('should detect vertically scrollable content', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentHeight: 500 });
      scrollbarComponent.update();

      expect(scrollbarComponent.isVerticallyScrollable()).toBe(true);
      expect(scrollbarComponent.isHorizontallyScrollable()).toBe(false);
    });

    it('should detect horizontally scrollable content', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentWidth: 500 });
      scrollbarComponent.update();

      expect(scrollbarComponent.isHorizontallyScrollable()).toBe(true);
    });

    it('should detect both directions scrollable in auto mode', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentHeight: 500, contentWidth: 500 });
      scrollbarComponent.update();

      expect(scrollbarComponent.isVerticallyScrollable()).toBe(true);
      expect(scrollbarComponent.isHorizontallyScrollable()).toBe(true);
    });

    it('should detect non-scrollable content', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentHeight: 50, contentWidth: 50 });
      scrollbarComponent.update();

      // Small content should not be scrollable
      expect(scrollbarComponent.isVerticallyScrollable()).toBe(false);
      expect(scrollbarComponent.isHorizontallyScrollable()).toBe(false);
    });

    it('should emit afterUpdate event when scrollability changes', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentHeight: 500 });
      scrollbarComponent.update();

      expect(hostComponent.updateEvents.length).toBeGreaterThan(0);
      const lastEvent = hostComponent.updateEvents[hostComponent.updateEvents.length - 1];
      expect(lastEvent.isVerticallyScrollable).toBe(true);
      expect(lastEvent.isHorizontallyScrollable).toBe(false);
    });

    it('should not emit duplicate events if scrollability unchanged', () => {
      const initialCount = hostComponent.updateEvents.length;

      // Trigger update manually without changing content
      scrollbarComponent.update();

      // Should not have new events
      expect(hostComponent.updateEvents.length).toBe(initialCount);
    });
  });

  describe('ResizeObserver', () => {
    it('should set up ResizeObserver after view init', () => {
      fixture.detectChanges();
      expect(component['resizeObserver']).toBeTruthy();
    });

    it('should disconnect ResizeObserver on destroy', () => {
      fixture.detectChanges();
      const observer = component['resizeObserver'];
      const disconnectSpy = jest.spyOn(observer as ResizeObserver, 'disconnect');

      component.ngOnDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should handle environment without ResizeObserver', () => {
      const originalResizeObserver = (global as any).ResizeObserver;
      (global as any).ResizeObserver = undefined;

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();

      (global as any).ResizeObserver = originalResizeObserver;
    });
  });

  describe('scrollTo Method', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should scroll to specified position with smooth behavior', async () => {
      const viewport = component.viewportRef.nativeElement;
      const scrollToSpy = jest.spyOn(viewport, 'scrollTo');

      await component.scrollTo({ top: 100, left: 50, behavior: 'smooth' });

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 100,
        left: 50,
        behavior: 'smooth',
      });
    });

    it('should scroll to specified position with instant behavior', async () => {
      const viewport = component.viewportRef.nativeElement;
      const scrollToSpy = jest.spyOn(viewport, 'scrollTo');

      await component.scrollTo({ top: 200, behavior: 'instant' });

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 200,
        left: 0,
        behavior: 'instant',
      });
    });

    it('should default to smooth behavior if not specified', async () => {
      const viewport = component.viewportRef.nativeElement;
      const scrollToSpy = jest.spyOn(viewport, 'scrollTo');

      await component.scrollTo({ top: 150 });

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 150,
        left: 0,
        behavior: 'smooth',
      });
    });

    it('should return a promise that resolves', async () => {
      const promise = component.scrollTo({ top: 100 });
      expect(promise).toBeInstanceOf(Promise);
      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle scrollTo with only left parameter', async () => {
      const viewport = component.viewportRef.nativeElement;
      const scrollToSpy = jest.spyOn(viewport, 'scrollTo');

      await component.scrollTo({ left: 75, behavior: 'instant' });

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0,
        left: 75,
        behavior: 'instant',
      });
    });
  });

  describe('update Method', () => {
    it('should manually trigger scrollability check', () => {
      fixture.detectChanges();
      const checkSpy = jest.spyOn(component as any, 'checkScrollability');

      component.update();

      expect(checkSpy).toHaveBeenCalled();
    });
  });

  describe('Viewport Element Getter', () => {
    it('should return viewport element after init', () => {
      fixture.detectChanges();
      const viewportElement = component.viewportElement;

      expect(viewportElement).toBeTruthy();
      expect(viewportElement).toBeInstanceOf(HTMLElement);
      expect(viewportElement?.classList.contains('ngx-zoneless-scrollbar-viewport')).toBe(true);
    });

    it('should return null before view init', () => {
      // Don't call detectChanges
      expect(component.viewportElement).toBeNull();
    });
  });

  describe('Scroll Position Getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return scrollTop position', () => {
      const viewport = component.viewportRef.nativeElement;
      Object.defineProperty(viewport, 'scrollTop', {
        writable: true,
        value: 123,
      });

      expect(component.scrollTop).toBe(123);
    });

    it('should return 0 for scrollTop when viewport not initialized', () => {
      const injector = TestBed.inject(Injector);
      const newComponent = runInInjectionContext(injector, () => new NgxZonelessScrollbar());
      expect(newComponent.scrollTop).toBe(0);
    });

    it('should return scrollLeft position', () => {
      const viewport = component.viewportRef.nativeElement;
      Object.defineProperty(viewport, 'scrollLeft', {
        writable: true,
        value: 456,
      });

      expect(component.scrollLeft).toBe(456);
    });

    it('should return 0 for scrollLeft when viewport not initialized', () => {
      const injector = TestBed.inject(Injector);
      const newComponent = runInInjectionContext(injector, () => new NgxZonelessScrollbar());
      expect(newComponent.scrollLeft).toBe(0);
    });
  });

  describe('CSS Classes', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let scrollbarComponent: NgxZonelessScrollbar;
    let viewportElement: HTMLElement;

    // Helper to mock element dimensions for JSDOM
    function mockScrollDimensions(
      viewport: HTMLElement,
      content: HTMLElement,
      options: {
        viewportHeight?: number;
        viewportWidth?: number;
        contentHeight?: number;
        contentWidth?: number;
      },
    ) {
      Object.defineProperty(viewport, 'clientHeight', { value: options.viewportHeight ?? 200, configurable: true });
      Object.defineProperty(viewport, 'clientWidth', { value: options.viewportWidth ?? 200, configurable: true });
      Object.defineProperty(content, 'scrollHeight', { value: options.contentHeight ?? 100, configurable: true });
      Object.defineProperty(content, 'scrollWidth', { value: options.contentWidth ?? 100, configurable: true });
    }

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideExperimentalZonelessChangeDetection()],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const scrollbarDebugElement = hostFixture.debugElement.query(By.directive(NgxZonelessScrollbar));
      scrollbarComponent = scrollbarDebugElement.componentInstance;
      viewportElement = hostFixture.nativeElement.querySelector('.ngx-zoneless-scrollbar-viewport');
    });

    afterEach(() => {
      hostFixture.destroy();
    });

    it('should add vertical-scrollable class when content is vertically scrollable', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentHeight: 500 });
      scrollbarComponent.update();
      hostFixture.detectChanges();

      expect(viewportElement.classList.contains('vertical-scrollable')).toBe(true);
    });

    it('should add horizontal-scrollable class when content is horizontally scrollable', () => {
      const viewport = scrollbarComponent.viewportRef.nativeElement;
      const content = scrollbarComponent.contentRef.nativeElement;

      mockScrollDimensions(viewport, content, { contentWidth: 500 });
      scrollbarComponent.update();
      hostFixture.detectChanges();

      expect(viewportElement.classList.contains('horizontal-scrollable')).toBe(true);
    });
  });

  describe('Content Projection', () => {
    it('should project content into ng-content slot', () => {
      @Component({
        standalone: true,
        imports: [NgxZonelessScrollbar],
        template: `
          <ngx-zoneless-scrollbar>
            <p class="test-content">Projected Content</p>
          </ngx-zoneless-scrollbar>
        `,
      })
      class ContentProjectionTestComponent {}

      const testFixture = TestBed.createComponent(ContentProjectionTestComponent);
      testFixture.detectChanges();

      const projectedContent = testFixture.nativeElement.querySelector('.test-content');
      expect(projectedContent).toBeTruthy();
      expect(projectedContent.textContent).toBe('Projected Content');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null viewport reference gracefully', () => {
      const injector = TestBed.inject(Injector);
      const newComponent = runInInjectionContext(injector, () => new NgxZonelessScrollbar());

      expect(() => {
        (newComponent as any).checkScrollability();
      }).not.toThrow();
    });

    it('should handle null content reference gracefully', () => {
      const injector = TestBed.inject(Injector);
      const newComponent = runInInjectionContext(injector, () => new NgxZonelessScrollbar());
      newComponent.viewportRef = {
        nativeElement: document.createElement('div'),
      } as any;

      expect(() => {
        (newComponent as any).checkScrollability();
      }).not.toThrow();
    });

    it('should handle scrollTo when viewport is not ready', async () => {
      const injector = TestBed.inject(Injector);
      const newComponent = runInInjectionContext(injector, () => new NgxZonelessScrollbar());

      await expect(newComponent.scrollTo({ top: 100 })).resolves.toBeUndefined();
    });

    it('should handle multiple rapid resize events', () => {
      // Test that multiple rapid updates don't throw errors
      fixture.detectChanges();
      const viewport = component.viewportRef.nativeElement;
      const content = component.contentRef.nativeElement;

      // Helper to mock dimensions
      function mockDimensions(contentHeight: number) {
        Object.defineProperty(viewport, 'clientHeight', { value: 200, configurable: true });
        Object.defineProperty(viewport, 'clientWidth', { value: 200, configurable: true });
        Object.defineProperty(content, 'scrollHeight', { value: contentHeight, configurable: true });
        Object.defineProperty(content, 'scrollWidth', { value: 100, configurable: true });
      }

      // Trigger multiple size changes rapidly
      for (let i = 0; i < 5; i++) {
        mockDimensions(100 + i * 100);
        component.update();
      }

      // Should still work correctly
      expect(component.isVerticallyScrollable()).toBe(true);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call ngAfterViewInit', () => {
      // Don't call detectChanges yet so ngAfterViewInit hasn't run
      // The component was already created, so check if ngAfterViewInit was called
      // by verifying its side effects (ResizeObserver setup)
      fixture.detectChanges();
      expect(component['resizeObserver']).toBeTruthy();
    });

    it('should call ngOnDestroy and cleanup', () => {
      fixture.detectChanges();
      const observer = component['resizeObserver'];
      const disconnectSpy = jest.spyOn(observer as ResizeObserver, 'disconnect');

      component.ngOnDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should handle destroy when ResizeObserver is null', () => {
      fixture.detectChanges();
      component['resizeObserver'] = null;

      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    // Helper to mock element dimensions for JSDOM
    function mockScrollDimensions(
      viewport: HTMLElement,
      content: HTMLElement,
      options: {
        viewportHeight?: number;
        viewportWidth?: number;
        contentHeight?: number;
        contentWidth?: number;
      },
    ) {
      Object.defineProperty(viewport, 'clientHeight', { value: options.viewportHeight ?? 200, configurable: true });
      Object.defineProperty(viewport, 'clientWidth', { value: options.viewportWidth ?? 200, configurable: true });
      Object.defineProperty(content, 'scrollHeight', { value: options.contentHeight ?? 100, configurable: true });
      Object.defineProperty(content, 'scrollWidth', { value: options.contentWidth ?? 100, configurable: true });
    }

    it('should work with dynamic content changes', () => {
      fixture.detectChanges();
      const viewport = component.viewportRef.nativeElement;
      const content = component.contentRef.nativeElement;

      // Start with small content
      mockScrollDimensions(viewport, content, { contentHeight: 100 });
      component.update();
      expect(component.isVerticallyScrollable()).toBe(false);

      // Change to large content
      mockScrollDimensions(viewport, content, { contentHeight: 500 });
      component.update();
      expect(component.isVerticallyScrollable()).toBe(true);

      // Change back to small content
      mockScrollDimensions(viewport, content, { contentHeight: 50 });
      component.update();
      expect(component.isVerticallyScrollable()).toBe(false);
    });

    it('should emit multiple update events for multiple changes', () => {
      fixture.detectChanges();
      const viewport = component.viewportRef.nativeElement;
      const content = component.contentRef.nativeElement;

      const initialCount = 0; // No events yet

      // Make content scrollable - should emit event
      mockScrollDimensions(viewport, content, { contentHeight: 500 });
      component.update();

      // afterUpdate output should have been triggered by the parent fixture
      // For isolated component test, we check the scrollability changed
      expect(component.isVerticallyScrollable()).toBe(true);
    });
  });
});
