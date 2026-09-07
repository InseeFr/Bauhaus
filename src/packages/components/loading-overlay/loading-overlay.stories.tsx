import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoadingOverlay } from "./";

// Contenu factice derrière l'overlay pour visualiser l'effet grisé plein écran.
const PageBehind = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Titre de la page</h1>
    <p>
      Contenu de la page recouvert par l'overlay pendant une opération bloquante (sauvegarde,
      chargement...).
    </p>
    <button type="button">Un bouton inaccessible pendant l'opération</button>
  </div>
);

const meta = {
  title: "Components/LoadingOverlay",
  component: LoadingOverlay,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <>
        <PageBehind />
        <Story />
      </>
    ),
  ],
  argTypes: {
    textType: {
      control: "select",
      options: [
        "loading",
        "saving",
        "deleting",
        "sending",
        "exporting",
        "validating",
        "authentification",
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sans prop : message générique de chargement du dictionnaire partagé. */
export const Default: Story = {};

/** Pendant une sauvegarde (utilisé par la page Instance Physique du module DDI). */
export const Saving: Story = {
  args: { textType: "saving" },
};

/** Message sur mesure fourni par l'appelant. */
export const CustomText: Story = {
  args: { text: "Duplication de l'instance physique..." },
};
