import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsive-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-layout" [class]="columns">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .responsive-layout {
      display: grid;
      gap: 1rem;
      width: 100%;
      
      &.one { grid-template-columns: 1fr; }
      
      &.two {
        grid-template-columns: 1fr;
        @media (min-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      &.three {
        grid-template-columns: 1fr;
        @media (min-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 992px) {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      &.four {
        grid-template-columns: 1fr;
        @media (min-width: 576px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 992px) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }
  `]
})
export class ResponsiveLayoutComponent {
  @Input() columns: 'one' | 'two' | 'three' | 'four' = 'one';
}