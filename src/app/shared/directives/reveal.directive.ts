import { Directive, ElementRef, OnInit, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit {
  @Input() delay: number = 0; // Delay in milliseconds

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.delay > 0) {
            setTimeout(() => {
              this.renderer.addClass(this.el.nativeElement, 'reveal--visible');
            }, this.delay);
          } else {
            this.renderer.addClass(this.el.nativeElement, 'reveal--visible');
          }
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(this.el.nativeElement);
  }
}
