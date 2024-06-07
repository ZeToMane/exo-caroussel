import { Renderer, Program, Color, Mesh, Triangle } from 'ogl';

export function setupCanvas(el: HTMLCanvasElement) {
    const vertex = /* glsl */ `
        attribute vec2 uv;
        attribute vec2 position;

        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0, 1);
        }
    `;

    const fragment = /* glsl */ `
        precision mediump float;

        #define SCALE 15.0

        uniform float uTime;
        uniform vec3 uColor;

        varying vec2 vUv;

        //Function that creates the main part of the shader, makes me imagine about buffers transporting bytes to deliver data
        vec4 byteFlow(vec4 c, vec2 uv)
        {
            //Here we create a grid for our uv
            uv *= vec2(80, 24); //Scale to grid (80 cols, 24 rows)
            uv = ceil(uv); //Snap the coords to the grid
            uv /= vec2(80, 24); //Make it normalised again

            //Scales the uv and corrects the shifting from the center
            uv = uv * SCALE - SCALE/2.0;

            //4 sines waves with different directions
            float s1 = sin(2.0*uv.x + uTime)*0.2; //horizontal wave
            float s2 = sin(5.0*uv.y + uTime) * 1.8 - 0.5; //vertical wave
            float s3 = sin(2.0*uv.x + uv.y - uTime)*1.3; //diagonal wave

            float r = sin(sqrt(uv.x * uv.x + uv.y * uv.y) - uTime)*1.3; //ring wave

            //The sum of all waves
            float sumWaves = s1 + s2 + s3 + r;
            
            //This part is arbritary, found the effet that I liked by trial and error
            return (c/(2.0*sumWaves))*(0.5*r);
        }

        //Same scanline effect for the CRT shader I made
        float scanline(vec2 uv){
            float scanlineIntensity = 0.05;
            return sin((15.*uv.y + uTime * 30.0) * 1.0) * scanlineIntensity;
        }

        void main() {
            vec2 uv = vUv;
            vec4 c = vec4(0.2, 1.0, 0.2, 0.0);

            gl_FragColor = byteFlow(c,uv) - scanline(uv);
        }
    `;

    {
        const renderer = new Renderer({ canvas: el });
        const gl = renderer.gl;
        //document.body.appendChild(gl.canvas);
        gl.clearColor(1, 1, 1, 1);

        function resize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', resize, false);
        resize();

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new Color(0.3, 0.2, 0.5) },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        requestAnimationFrame(update);
        function update(t: number) {
            requestAnimationFrame(update);

            program.uniforms.uTime.value = t * 0.001;

            renderer.render({ scene: mesh });
        }
    }
}
