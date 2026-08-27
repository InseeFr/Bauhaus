import { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { PublishButton } from "@components/buttons/buttons-with-icons";
import { ModalButton, ModalRmes } from "@components/modal-rmes/modal-rmes";
import { Picker } from "@components/picker-page";

import { getModalMessage } from "../../../../utils/getModalMessage";

interface ConceptToValidate {
  id: string;
  label: string;
  valid?: string | null;
}

interface IdWithValid {
  prefLabelLg1: string;
  valid: string;
}

interface ConceptsToValidateProps extends WithTranslation {
  concepts: ConceptToValidate[];
  handleValidateConceptList: (ids: string[]) => void;
}

interface ConceptsToValidateState {
  modalValid: boolean;
  idWithValid: IdWithValid[];
  ids?: string[];
}

class ConceptsToValidate extends Component<ConceptsToValidateProps, ConceptsToValidateState> {
  constructor(props: ConceptsToValidateProps) {
    super(props);
    this.state = {
      modalValid: false,
      idWithValid: [],
    };
  }

  handleValidateConceptList = (ids: string[]) => {
    this.props.handleValidateConceptList(ids);
  };

  handleClickValidation = (ids: string[]) => {
    this.setState({ ids });
    const idWithValid = ids.reduce<IdWithValid[]>((acc, id) => {
      const concept = this.props.concepts.find((c) => c.id === id);
      if (!concept) return acc;
      const { label: prefLabelLg1, valid } = concept;
      if (valid) acc.push({ prefLabelLg1, valid });
      return acc;
    }, []);

    if (idWithValid.length === 0) {
      this.handleValidateConceptList(ids);
    } else {
      this.setState({ idWithValid, modalValid: true });
    }
  };

  handleCancelValidation = () => this.setState({ modalValid: false });

  handleConfirmValidation = () => {
    this.handleCancelValidation();
    if (this.state.ids) this.handleValidateConceptList(this.state.ids);
  };

  render() {
    const { modalValid, idWithValid } = this.state;
    const { concepts, t } = this.props;

    const modalButtons: ModalButton[] = [
      {
        label: t("common.btnCancel"),
        action: this.handleCancelValidation,
        style: "primary",
        disabled: false,
      },
      {
        label: t("common.btnValid"),
        action: this.handleConfirmValidation,
        style: "primary",
        disabled: false,
      },
    ];

    return (
      <div>
        <Picker
          items={concepts}
          title={t("concept.validation.title")}
          panelTitle={t("concept.validation.panelTitle")}
          labelWarning={t("concept.validation.hasNot")}
          ValidationButton={PublishButton}
          handleAction={this.handleClickValidation}
          context="concepts"
        />
        <ModalRmes
          id="validation-concept-modal"
          isOpen={modalValid}
          title="Confirmation de la validation"
          body={getModalMessage(idWithValid) as unknown as Node}
          modalButtons={modalButtons}
          closeCancel={this.handleCancelValidation}
        />
      </div>
    );
  }
}

export default withTranslation()(ConceptsToValidate);
