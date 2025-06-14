import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

gsap.registerPlugin(gsap.plugins.attr);

@Component({
  selector: 'app-initial-page-loader',
  templateUrl: './initial-page-loader.component.html',
  styleUrls: ['./initial-page-loader.component.scss']
})
export class InitialPageLoaderComponent implements OnInit, AfterViewInit {
  @ViewChild('svgPath', { static: true }) svgPath!: ElementRef;
  @ViewChild('loaderWrap', { static: true }) loaderWrap!: ElementRef;
  @ViewChild('container', { static: true }) container!: ElementRef;

  @Output() animationComplete = new EventEmitter<void>();
  @Output() readyToDestroy = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = "hidden";
      this.container.nativeElement.style.visibility = "hidden";
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loaderWrap.nativeElement.style.transform = "translateY(0)";
      this.loaderWrap.nativeElement.style.display = "block";

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "visible";
          gsap.to(this.container.nativeElement, {
            duration: 0.5,
            opacity: 1,
            onComplete: () => {
              this.container.nativeElement.style.visibility = "visible";
              
              // Emit that animation is complete
              this.animationComplete.emit();
              
              // Wait a bit then emit ready to destroy
              setTimeout(() => {
                this.readyToDestroy.emit();
              }, 500); // Adjust delay as needed
            }
          })
        },
      });

      const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
      const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

      tl.to(this.svgPath.nativeElement, {
        duration: 0.8,
        attr: { d: curve },
        ease: "power2.easeIn",
        fill: "#00C9FF",
      }).to(this.svgPath.nativeElement, {
        duration: 0.8,
        attr: { d: flat },
        ease: "power2.easeOut",
        fill: "#B0BEC5",
      });

      tl.to(this.loaderWrap.nativeElement, {
        y: -1500,
        display: "none",
        onComplete: () => {
          this.loaderWrap.nativeElement.style.display = "none";
        },
      });
      gsap.set(this.container.nativeElement, { opacity: 0, y: 100 });
    }
  }
}