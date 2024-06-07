import './style.css'
import { setupCanvas } from './webgl-canvas.ts'
import { Carousel } from './carousel.ts'

const images: string[] = ['/img.jpg', '/img2.jpg', '/img3.jpg', '/img4.webp', '/img5.jpeg', '/img6.jpg', '/img7.jpg', '/img8.jpg']

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="webgl-canvas"></canvas>
  <main>
    <section class="window">
      <div class="head">
        <h1><span class="arrow">></span> Hello World !</h1>
        <div id="button-container" class="button-container"></div>
      </div>
      <div class="content">
        <div id="carousel" class="carousel"></div>
      </div>
    </section>
  </main>
`
//WebGL Canvas setup
setupCanvas(document.querySelector<HTMLCanvasElement>('#webgl-canvas')!)

//Carousel initialisation
new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 4)

//Carousel breakpoints for responsive
//Could have made a function to do all of those lines, but I don't think it would be much relevant to the exercise
if (window.matchMedia("(min-width: 1280px)").matches) {
  new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 4);
} else if (window.matchMedia("(min-width: 1024px)").matches) {
  new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 3);
} else if (window.matchMedia("(min-width: 768px)").matches) {
  new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 2);
} else if (window.matchMedia("(min-width: 480px)").matches) {
  new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 2);
} else if (window.matchMedia("(max-width: 479px)").matches) {
  new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 16, 1);
}

window.addEventListener('resize', () => {
  if (window.matchMedia("(min-width: 1280px)").matches) {
      new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 4);
  } else if (window.matchMedia("(min-width: 1024px)").matches) {
      new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 3);
  } else if (window.matchMedia("(min-width: 768px)").matches) {
      new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 2);
  } else if (window.matchMedia("(min-width: 480px)").matches) {
      new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 24, 1);
  } else if (window.matchMedia("(max-width: 479px)").matches) {
      new Carousel(document.querySelector<HTMLElement>('#carousel')!, document.querySelector<HTMLElement>('#button-container')!, images, 16, 1);
  }
});

