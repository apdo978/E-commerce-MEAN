import { Directive, ElementRef, Input, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appResponsiveImage]',
  standalone: true
})
export class ResponsiveImageDirective implements OnInit {
  @Input() mobileSrc?: string;
  @Input() tabletSrc?: string;
  @Input() desktopSrc?: string;
  
  private defaultSrc: string = '';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit() {
    const img = this.el.nativeElement;
    this.defaultSrc = img.src;
    
    // Add loading="lazy" for better performance
    img.loading = 'lazy';
    
    // Setup responsive srcset
    this.updateSrcSet();
    
    // Add error handling
    img.onerror = () => {
      img.src = this.defaultSrc;
    };
  }

  private updateSrcSet() {
    const img = this.el.nativeElement;
    
    let srcset = [];
    if (this.mobileSrc) srcset.push(`${this.mobileSrc} 480w`);
    if (this.tabletSrc) srcset.push(`${this.tabletSrc} 768w`);
    if (this.desktopSrc) srcset.push(`${this.desktopSrc} 1200w`);
    
    if (srcset.length > 0) {
      img.srcset = srcset.join(', ');
      img.sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px';
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSrcSet();
  }
}