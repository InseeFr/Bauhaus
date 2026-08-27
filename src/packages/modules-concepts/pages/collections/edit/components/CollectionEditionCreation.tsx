import { Component } from "react";

import { PageTitle } from "@components/page-title";

import { CollectionGeneral, CollectionMember, PartialCollection } from "@model/concepts/collection";

import { Menu } from "../menu";
import { validate } from "../validation";
import GeneralEdition from "./CollectionGeneralEdition";
import CollectionMembersEdition from "./CollectionMembersEdition";

interface MemberItem {
  id: string;
  label: string;
}

interface CollectionEditionState {
  id: string;
  data: {
    general: CollectionGeneral;
    members: MemberItem[];
  };
}

interface CollectionEditionCreationProps {
  title: string;
  subtitle?: string;
  creation?: boolean;
  general: CollectionGeneral;
  members: CollectionMember[];
  collectionList: PartialCollection[];
  conceptList: { id: string; label: string }[];
  save: (data: { general: CollectionGeneral; members: MemberItem[] }) => void;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}

class CollectionEditionCreation extends Component<
  CollectionEditionCreationProps,
  CollectionEditionState
> {
  constructor(props: CollectionEditionCreationProps) {
    super(props);
    const { general, members } = props;

    this.state = {
      id: general.id,
      data: {
        general: { ...general },
        members: members.map(({ id, prefLabelLg1 }) => ({ id, label: prefLabelLg1 })),
      },
    };
  }

  handleChangeGeneral = (update: Partial<CollectionGeneral>) => {
    this.props.setSubmitting(true);
    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        general: { ...state.data.general, ...update },
      },
    }));
  };

  handleChangeMembers = (newMembers: MemberItem[]) => {
    this.props.setSubmitting(true);
    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        members: newMembers,
      },
    }));
  };

  handleSave = () => {
    this.saveCollection();
  };

  redirectCancel = (): string =>
    this.props.creation
      ? `/concepts/collections`
      : `/concepts/collections/${this.props.general.id}`;

  saveCollection = () => {
    this.props.save(this.state.data);
  };

  render() {
    const { title, subtitle, collectionList, conceptList } = this.props;

    const {
      data: { general, members },
    } = this.state;

    const { id: initialId, prefLabelLg1: initialPrefLabelLg1 } = this.props.general;

    const errors = validate(
      general,
      collectionList.map((c) => ({ id: c.id, label: c.label?.value ?? "" })),
      initialId,
      initialPrefLabelLg1,
    );

    return (
      <div>
        <div className="container">
          <PageTitle title={title} subtitle={subtitle} />
          <Menu handleSave={this.handleSave} redirectCancel={this.redirectCancel} errors={errors} />
          <GeneralEdition
            general={general}
            handleChange={this.handleChangeGeneral}
            errors={errors}
            creation={this.props.creation}
          />
          <CollectionMembersEdition
            members={members}
            conceptList={conceptList}
            handleChange={this.handleChangeMembers}
          />
        </div>
      </div>
    );
  }
}

export default CollectionEditionCreation;
