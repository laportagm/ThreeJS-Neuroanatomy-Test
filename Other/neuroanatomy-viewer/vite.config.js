import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    open: true,
    port: 3000
  },
  resolve: {
    alias: {
      // Simplify the imports from Three.js examples
      'three': 'three',
      'GLTFLoader': 'three/examples/jsm/loaders/GLTFLoader.js',
      'OrbitControls': 'three/examples/jsm/controls/OrbitControls.js'
    }
  }
});
