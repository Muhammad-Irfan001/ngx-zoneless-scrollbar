# ngx-zoneless-scrollbar

[![npm version](https://img.shields.io/npm/v/ngx-zoneless-scrollbar.svg)](https://www.npmjs.com/package/ngx-zoneless-scrollbar)
[![npm downloads](https://img.shields.io/npm/dm/ngx-zoneless-scrollbar.svg)](https://www.npmjs.com/package/ngx-zoneless-scrollbar)
[![License](https://img.shields.io/npm/l/ngx-zoneless-scrollbar.svg)](https://github.com/Legalfina/ngx-zoneless-scrollbar/blob/main/LICENSE)
[![CI Build](https://github.com/Legalfina/ngx-zoneless-scrollbar/actions/workflows/publish.yml/badge.svg)](https://github.com/Legalfina/ngx-zoneless-scrollbar/actions/workflows/publish.yml)
[![codecov](https://codecov.io/gh/Legalfina/ngx-zoneless-scrollbar/branch/main/graph/badge.svg)](https://codecov.io/gh/Legalfina/ngx-zoneless-scrollbar)

A lightweight, zoneless-compatible scrollbar component for Angular. Uses native browser scrolling with CSS-styled scrollbars, designed specifically for Angular's zoneless change detection mode.

## Why ngx-zoneless-scrollbar?

Angular's zoneless mode (`provideZonelessChangeDetection()`) offers significant performance benefits, but many existing scrollbar libraries rely on Zone.js for change detection and `afterRenderEffect` callbacks that may not work correctly in zoneless mode.

**ngx-zoneless-scrollbar** solves this by:

- Using **native browser scrolling** - 100% reliable, no Zone.js dependency
- Using **ResizeObserver** directly - detects content changes without Angular's lifecycle
- Being **fully signal-based** - works seamlessly with Angular's reactive primitives
- Providing **CSS-styled scrollbars** - customizable appearance on all modern browsers

## Features

✅ **Zoneless Compatible** - Works perfectly with `provideZonelessChangeDetection()`  
✅ **Lightweight** - No heavy dependencies, uses native browser APIs  
✅ **Signal-based** - Exposes scrollability state as Angular signals  
✅ **Touch Friendly** - Supports momentum scrolling on mobile devices  
✅ **Customizable** - Easy to style with CSS variables  
✅ **Standalone** - Works with Angular's standalone components

## Installation

```bash
npm install ngx-zoneless-scrollbar
```

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { NgxZonelessScrollbar } from 'ngx-zoneless-scrollbar';

@Component({
  standalone: true,
  imports: [NgxZonelessScrollbar],
  template: `
    <ngx-zoneless-scrollbar>
      <div>Your scrollable content here</div>
    </ngx-zoneless-scrollbar>
  `,
  styles: [
    `
      ngx-zoneless-scrollbar {
        height: 400px; /* Required: Set a height for scrolling to work */
      }
    `,
  ],
})
export class MyComponent {}
```

### With Event Binding

```typescript
import { Component } from '@angular/core';
import { NgxZonelessScrollbar, ScrollbarUpdateEvent } from 'ngx-zoneless-scrollbar';

@Component({
  standalone: true,
  imports: [NgxZonelessScrollbar],
  template: `
    <ngx-zoneless-scrollbar #scrollbar (afterUpdate)="onScrollbarUpdate($event)">
      <div>Your content</div>
    </ngx-zoneless-scrollbar>

    <p *ngIf="scrollbar.isVerticallyScrollable()">Content is scrollable!</p>
  `,
})
export class MyComponent {
  onScrollbarUpdate(event: ScrollbarUpdateEvent) {
    console.log('Vertically scrollable:', event.isVerticallyScrollable);
    console.log('Horizontally scrollable:', event.isHorizontallyScrollable);
  }
}
```

### Programmatic Scrolling

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxZonelessScrollbar } from 'ngx-zoneless-scrollbar';

@Component({
  standalone: true,
  imports: [NgxZonelessScrollbar],
  template: `
    <ngx-zoneless-scrollbar #scrollbar>
      <div>Your content</div>
    </ngx-zoneless-scrollbar>

    <button (click)="scrollToTop()">Scroll to Top</button>
  `,
})
export class MyComponent {
  @ViewChild('scrollbar') scrollbar!: NgxZonelessScrollbar;

  scrollToTop() {
    this.scrollbar.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
```

## API Reference

### Inputs

| Input         | Type                                           | Default      | Description      |
| ------------- | ---------------------------------------------- | ------------ | ---------------- |
| `orientation` | `'vertical' &#124; 'horizontal' &#124; 'auto'` | `'vertical'` | Scroll direction |

### Outputs

| Output        | Type                   | Description                            |
| ------------- | ---------------------- | -------------------------------------- |
| `afterUpdate` | `ScrollbarUpdateEvent` | Emits when scrollability state changes |

### Public Properties (Signals)

| Property                   | Type              | Description                                |
| -------------------------- | ----------------- | ------------------------------------------ |
| `isVerticallyScrollable`   | `Signal<boolean>` | Whether content is vertically scrollable   |
| `isHorizontallyScrollable` | `Signal<boolean>` | Whether content is horizontally scrollable |

### Public Methods

| Method                               | Description                            |
| ------------------------------------ | -------------------------------------- |
| `scrollTo(options: ScrollToOptions)` | Scroll to a specific position          |
| `update()`                           | Manually trigger a scrollability check |
| `viewportElement`                    | Get the native viewport element        |

## Styling

### CSS Variables

Customize the scrollbar appearance using CSS:

```css
ngx-zoneless-scrollbar {
  /* Scrollbar size */
  --scrollbar-size: 8px;

  /* Track styling */
  --scrollbar-track-color: transparent;
  --scrollbar-track-radius: 4px;

  /* Thumb styling */
  --scrollbar-thumb-color: rgba(0, 0, 0, 0.3);
  --scrollbar-thumb-color-hover: rgba(0, 0, 0, 0.5);
  --scrollbar-thumb-radius: 4px;
}
```

### Custom Styles Example

```css
/* Dark theme scrollbar */
.dark-theme ngx-zoneless-scrollbar {
  --scrollbar-thumb-color: rgba(255, 255, 255, 0.3);
  --scrollbar-thumb-color-hover: rgba(255, 255, 255, 0.5);
}

/* Thin scrollbar */
.thin-scrollbar ngx-zoneless-scrollbar {
  --scrollbar-size: 4px;
}
```

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 64+
- ✅ Safari 14+
- ✅ Edge 88+

All browsers that support CSS `scrollbar-width` and `::-webkit-scrollbar` pseudo-elements.

## Migration from ngx-scrollbar

If you're migrating from `ngx-scrollbar` due to zoneless compatibility issues:

```html
<!-- Before (ngx-scrollbar) -->
<ng-scrollbar #scrollbar="ngScrollbar" (afterUpdate)="onUpdate(scrollbar.adapter.isVerticallyScrollable())">
  <content />
</ng-scrollbar>

<!-- After (ngx-zoneless-scrollbar) -->
<ngx-zoneless-scrollbar #scrollbar (afterUpdate)="onUpdate($event.isVerticallyScrollable)">
  <content />
</ngx-zoneless-scrollbar>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contributors

- [Farshad Hemmati](https://github.com/farshadhemmati)

## License

MIT © [Legalfina](https://www.legalfina.com/en)
