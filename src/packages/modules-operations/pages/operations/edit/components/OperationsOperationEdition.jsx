import i18next from "../../../../i18n";
import { Component } from "react";

import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import LabelRequired from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { Controls } from "./Controls";
import { YearInput } from "./YearInput";
import { validate } from "../validation";
import { Series } from "./Series";

const defaultOperation = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  altLabelLg1: "",
  altLabelLg2: "",
  year: undefined,
};

export class OperationsOperationEdition extends Component {
  constructor(props) {
    super(props);
    this.state = this.setInitialState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.operation.id !== this.props.operation.id) {
      this.setState(this.setInitialState(nextProps));
    }
  }

  setInitialState = (props) => {
    return {
      serverSideError: "",
      clientSideErrors: {},
      saving: false,
      submitting: false,
      operation: {
        ...defaultOperation,
        ...props.operation,
      },
    };
  };

  onChange = (e) => {
    let override = {
      [e.target.id]: e.target.value,
    };
    if (e.target.id === "idSeries") {
      override = {
        series: {
          id: e.target.value,
        },
      };
    }
    this.setState((state) => ({
      serverSideError: "",
      submitting: true,
      clientSideErrors: {
        ...state.clientSideErrors,
        errorMessage: [],
      },
      operation: {
        ...state.operation,
        ...override,
      },
    }));
  };

  onSubmit = () => {
    const clientSideErrors = validate(this.state.operation);
    if (clientSideErrors.errorMessage?.length > 0) {
      this.setState({
        submitting: true,
        clientSideErrors,
      });
    } else {
      this.setState({ saving: true });
      const isCreation = !this.state.operation.id;

      const method = isCreation ? "postOperation" : "putOperation";
      return OperationsApi[method](this.state.operation)
        .then(
          (id = this.state.operation.id) => {
            this.props.goBack(`/operations/operation/${id}`, isCreation);
          },
          (err) => {
            this.setState({
              serverSideError: err,
            });
          },
        )
        .finally(() => this.setState({ saving: false }));
    }
  };

  render() {
    if (this.state.saving) return <Saving />;

    const { operation, serverSideError } = this.state;

    const series = operation.series || { id: "" };

    const isEditing = !!operation.id;

    return (
      <div className="container editor-container">
        {isEditing && (
          <PageTitleBlock
            titleLg1={this.props.operation.prefLabelLg1}
            titleLg2={this.props.operation.prefLabelLg2}
          />
        )}
        <Controls
          onSubmit={this.onSubmit}
          disabled={this.state.clientSideErrors.errorMessage?.length > 0}
        />
        {this.state.submitting && this.state.clientSideErrors && (
          <GlobalClientSideErrorBloc clientSideErrors={this.state.clientSideErrors.errorMessage} />
        )}
        <ErrorBloc error={serverSideError} />
        <form>
          {!isEditing && (
            <Series
              label={i18next.t("common.seriesTitle")}
              value={series.id}
              onChange={(value) =>
                this.onChange({
                  target: { value, id: "idSeries" },
                })
              }
            ></Series>
          )}
          <Row className="bauhaus-row">
            <div className="form-group">
              <LabelRequired htmlFor="prefLabelLg1">
                {i18next.t("common.title", { lng: "fr" })}
              </LabelRequired>
              <TextInput
                id="prefLabelLg1"
                value={operation.prefLabelLg1}
                onChange={this.onChange}
                aria-invalid={!!this.state.clientSideErrors.fields?.prefLabelLg1}
                aria-describedby={
                  this.state.clientSideErrors.fields?.prefLabelLg1 ? "prefLabelLg1-error" : null
                }
              />
              <ClientSideError
                id="prefLabelLg1-error"
                error={this.state.clientSideErrors?.fields?.prefLabelLg1}
              ></ClientSideError>
            </div>
            <div className="form-group">
              <LabelRequired htmlFor="prefLabelLg2">
                {i18next.t("common.title", { lng: "en" })}
              </LabelRequired>
              <TextInput
                id="prefLabelLg2"
                value={operation.prefLabelLg2}
                onChange={this.onChange}
                aria-invalid={!!this.state.clientSideErrors.fields?.prefLabelLg2}
                aria-describedby={
                  this.state.clientSideErrors.fields?.prefLabelLg2 ? "prefLabelLg2-error" : null
                }
              />
              <ClientSideError
                id="prefLabelLg2-error"
                error={this.state.clientSideErrors?.fields?.prefLabelLg2}
              ></ClientSideError>
            </div>
          </Row>
          <Row className="bauhaus-row">
            <div className="form-group">
              <label htmlFor="altLabelLg1">{i18next.t("app.altLabel", { lng: "fr" })}</label>
              <TextInput id="altLabelLg1" value={operation.altLabelLg1} onChange={this.onChange} />
            </div>
            <div className="form-group">
              <label htmlFor="altLabelLg2">{i18next.t("app.altLabel", { lng: "en" })}</label>
              <TextInput id="altLabelLg2" value={operation.altLabelLg2} onChange={this.onChange} />
            </div>
          </Row>
          <YearInput
            value={operation.year}
            onChange={(value) => {
              this.onChange({
                target: { value, id: "year" },
              });
            }}
            error={this.state.clientSideErrors?.fields?.year}
          />
        </form>
      </div>
    );
  }
}
