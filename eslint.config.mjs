import js from "@eslint/js";
import globals from "globals";

export default [
  // Configuration recommandée ESLint
  js.configs.recommended,
  
  // Configuration pour les fichiers JavaScript
  {
    files: ["**/*.{js,mjs,cjs}"],
    
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      }
    },
    
    rules: {
      // Règles de style
      "indent": ["error", 2],
      "quotes": ["error", "single", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      
      // Bonnes pratiques
      "no-console": "off", // Autorisé pour les logs de debug
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": "error",
      
      // Compatibilité navigateur
      "no-undef": "error",
      "no-unused-expressions": "warn"
    }
  },
  
  // Ignorer certains fichiers
  {
    ignores: [
      "node_modules/",
      "dist/",
      "httpdocs/assets/js/",
      "*.config.js",
      "*.config.mjs"
    ]
  }
];