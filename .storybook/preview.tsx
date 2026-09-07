import type { Preview } from '@storybook/react-vite'

// Mêmes styles globaux que l'application (cf. src/packages/application/app.tsx) :
// indispensables pour que les composants PrimeReact/PrimeFlex rendent comme en vrai.
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;