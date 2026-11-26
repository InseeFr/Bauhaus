import { ProgressSpinner } from "@mantle-ui/react/progressspinner";

import { getLoadingText } from "./getLoadingText";

interface LoadingTypes {
  text?: string;
  textType?: string;
}

export const Loading = ({ text, textType }: LoadingTypes) => {
  const content = text || getLoadingText(textType);

  return (
    <output
      className="flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "400px" }}
      aria-live="polite"
      aria-label={content}
    >
      {/* Le `role="progressbar"` que PrimeReact pose sur le spinner n'a pas de
          nom accessible ; c'est le conteneur qui porte le message. Le masquer
          évite une violation axe et une annonce en double. */}
      <ProgressSpinner aria-hidden />
      <p>{content}</p>
    </output>
  );
};

export const Deleting = () => <Loading textType="deleting" />;
export const Publishing = () => <Loading textType="validating" />;
export const Saving = () => <Loading textType="saving" />;
export const Exporting = () => <Loading textType="exporting" />;
