export default {
  content: ["./frontend/index.html","./frontend/js/**/*.js"],
  theme: {
    extend: {
      colors: { bg:"#050509", elevated:"#0b0b12", soft:"#141424", accent:"#d9a441", muted:"#9c9cab" },
      fontFamily: {
        display:["Cormorant Garamond","serif"],
        sans:["Inter","system-ui","-apple-system","Segoe UI","sans-serif"]
      },
      boxShadow: { glow:"0 20px 80px rgba(0,0,0,0.55)" }
    }
  },
  plugins: []
};
