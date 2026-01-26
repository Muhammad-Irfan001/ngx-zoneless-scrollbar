import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NgxZonelessScrollbar } from 'ngx-zoneless-scrollbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxZonelessScrollbar],
  template: `
    <div class="container">
      <h1>ngx-zoneless-scrollbar Demo</h1>
      <p class="subtitle">A lightweight, zoneless-compatible scrollbar component for Angular</p>

      <div class="columns">
        <!-- Column 1: No Scrollbar (minimal content) -->
        <div class="column">
          <h2>No Scrollbar</h2>
          <ngx-zoneless-scrollbar class="scrollbar-default">
            <div class="content">
              <p>This column has minimal content, so the scrollbar won't activate.</p>
              <p>The component intelligently detects when content is scrollable.</p>
            </div>
          </ngx-zoneless-scrollbar>
        </div>

        <!-- Column 2: Default Style -->
        <div class="column">
          <h2>Default Style</h2>
          <ngx-zoneless-scrollbar class="scrollbar-default">
            <div class="content">
              <h3>Lorem Ipsum</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <h3>More Content</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                beatae vitae dicta sunt explicabo.
              </p>
              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              <h3>Even More Content</h3>
              <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem.
              </p>
              <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
              <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
            </div>
          </ngx-zoneless-scrollbar>
        </div>

        <!-- Column 3: Dark Theme -->
        <div class="column">
          <h2>Dark Theme</h2>
          <ngx-zoneless-scrollbar class="scrollbar-dark">
            <div class="content dark-content">
              <h3>Dark Mode Content</h3>
              <p>This scrollbar uses a dark theme with custom styling using CSS variables.</p>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                cupiditate non provident.
              </p>
              <h3>Custom Colors</h3>
              <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
              <p>
                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>
              <h3>More Dark Content</h3>
              <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
              <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </ngx-zoneless-scrollbar>
        </div>

        <!-- Column 4: Thin Scrollbar -->
        <div class="column">
          <h2>Thin Scrollbar</h2>
          <ngx-zoneless-scrollbar class="scrollbar-thin">
            <div class="content">
              <h3>Minimal Design</h3>
              <p>This column features a thin, minimalist scrollbar perfect for modern UIs.</p>
              <p>
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
              <h3>Sleek & Modern</h3>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
              <p>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
              <h3>Additional Content</h3>
              <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.</p>
              <p>Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>
            </div>
          </ngx-zoneless-scrollbar>
        </div>
      </div>

      <footer>
        <p>
          <strong>ngx-zoneless-scrollbar</strong> - Built with ❤️ by
          <a href="https://www.legalfina.com/en" target="_blank">Legalfina</a>
        </p>
        <p>
          <a href="https://github.com/Legalfina/ngx-zoneless-scrollbar" target="_blank">GitHub</a> |
          <a href="https://www.npmjs.com/package/ngx-zoneless-scrollbar" target="_blank">npm</a>
        </p>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
      }

      h1 {
        color: white;
        text-align: center;
        font-size: 3rem;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 3rem;
      }

      .columns {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .column {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }

      .column h2 {
        margin-top: 0;
        color: #667eea;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .column h3 {
        color: #764ba2;
        font-size: 1.2rem;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .content {
        padding: 1rem;
        line-height: 1.6;
      }

      .content p {
        margin-bottom: 1rem;
        color: #333;
      }

      /* Default scrollbar style */
      .scrollbar-default {
        height: 400px;
        --scrollbar-size: 8px;
        --scrollbar-thumb-color: rgba(102, 126, 234, 0.5);
        --scrollbar-thumb-color-hover: rgba(102, 126, 234, 0.8);
        --scrollbar-thumb-radius: 4px;
      }

      /* Dark theme scrollbar */
      .scrollbar-dark {
        height: 400px;
        background: #1a1a2e;
        border-radius: 8px;
        --scrollbar-size: 10px;
        --scrollbar-thumb-color: rgba(255, 255, 255, 0.3);
        --scrollbar-thumb-color-hover: rgba(255, 255, 255, 0.5);
        --scrollbar-thumb-radius: 5px;
      }

      .dark-content {
        background: #1a1a2e;
      }

      .dark-content h3 {
        color: #bb86fc;
      }

      .dark-content p {
        color: #e0e0e0;
      }

      /* Thin scrollbar style */
      .scrollbar-thin {
        height: 400px;
        --scrollbar-size: 4px;
        --scrollbar-thumb-color: rgba(118, 75, 162, 0.4);
        --scrollbar-thumb-color-hover: rgba(118, 75, 162, 0.7);
        --scrollbar-thumb-radius: 2px;
      }

      footer {
        text-align: center;
        color: white;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      footer p {
        margin: 0.5rem 0;
      }

      footer a {
        color: white;
        text-decoration: none;
        margin: 0 0.5rem;
        font-weight: 500;
      }

      footer a:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .columns {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class App {
  name = 'ngx-zoneless-scrollbar Demo';
}

bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
