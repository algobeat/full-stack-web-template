import * as React from "react";
import { KeyboardEvent, useState } from "react";
import {
  FormControl,
  IconButton,
  TextField,
  TextFieldProps,
  TypographyProps,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Controller, useForm, Validate } from "react-hook-form";
import { Check, Clear, Edit } from "@material-ui/icons";
import { assertUnreachable } from "../../utils";
import styled from "styled-components";
import Select from "react-select";

export interface EditableTextPropsBase {
  editable?: boolean;
  onSave: (data: string) => Promise<any>;
  value: string;
  validate?: Validate;

  textFieldProps?: TextFieldProps;
  typographyProps?: TypographyProps;
  selectValues?: { value: string; label: string }[];
  type?: "text" | "select";
}

export type EditableTextFieldProps = EditableTextPropsBase & {
  type?: "text";
};

export type EditableSelectProps = EditableTextPropsBase & {
  type: "select";
  selectValues: { value: string; label: string }[];
};

export type EditableTextProps = EditableTextFieldProps | EditableSelectProps;

const SelectFormControl = styled(FormControl)`
  &&& {
    min-width: 120px;
  }
`;

// The idea is to remount this when values change so that the initial value is correct.
function EditableTextInternal(
  props: EditableTextProps & { setEditing: (data: boolean) => void }
) {
  const { register, errors, handleSubmit, control } = useForm({
    defaultValues: {
      input: props.value,
    },
  });

  const onSubmit = async (data: any) => {
    console.log("onSubmit called");
    console.log(data + ", " + props.value);
    if (data.input !== props.value) {
      await props.onSave(data.input);
    }
    props.setEditing(false);
  };

  const onSubmitSelect = async (data: any) => {
    return onSubmit({ input: data.input.value });
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit);
    }
  };

  switch (props.type) {
    case "text":
    case undefined:
      return (
        <TextField
          {...props.textFieldProps}
          onBlur={handleSubmit(onSubmit)}
          onKeyDown={handleInputKeyDown}
          name={"input"}
          error={!!errors.input}
          helperText={errors.input}
          inputRef={register({ validate: props.validate })}
        />
      );
    case "select":
      return (
        <React.Fragment>
          <SelectFormControl>
            <Controller
              name={"input"}
              as={Select}
              options={props.selectValues}
              control={control}
              defaultValue={props.value}
            />
          </SelectFormControl>
          <IconButton onClick={handleSubmit(onSubmitSelect)} color={"primary"}>
            <Check />
          </IconButton>
          <IconButton
            onClick={props.setEditing.bind(null, false)}
            color={"default"}
          >
            <Clear />
          </IconButton>
        </React.Fragment>
      );
  }
  assertUnreachable(props);
}

export default function EditableText(props: EditableTextProps) {
  const [editing, setEditing] = useState(false);

  const editable = props.editable === undefined || props.editable;

  if (editing) {
    // return the text box
    return <EditableTextInternal {...props} setEditing={setEditing} />;
  } else {
    // Return display text, with props.
    return (
      <React.Fragment>
        <Typography
          display={"inline"}
          {...props.typographyProps}
          onDoubleClick={() => editable && setEditing(true)}
        >
          {(props.selectValues &&
            props.selectValues.find(({ value }) => value === props.value)
              ?.label) ||
            props.value}
        </Typography>
        {editable && (
          <IconButton onClick={() => setEditing(true)}>
            <Edit />
          </IconButton>
        )}
      </React.Fragment>
    );
  }
}
