import * as React from "react";
import {
  IconButton,
  TextField,
  TextFieldProps,
  TypographyProps,
} from "@material-ui/core";
import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useForm, Validate } from "react-hook-form";
import { Edit } from "@material-ui/icons";
import { KeyboardEvent } from "react";

export type EditableTextProps = {
  editable?: boolean;
  onSave: (data: string) => Promise<any>;
  value: string;
  validate?: Validate;

  textFieldProps?: TextFieldProps;
  typographyProps?: TypographyProps;
};

// The idea is to remount this when values change so that the initial value is correct.
function EditableTextInternal(
  props: EditableTextProps & { setEditing: (data: boolean) => void }
) {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      input: props.value,
    },
  });

  const onSubmit = async (data: any) => {
    if (data.input !== props.value) {
      await props.onSave(data.input);
      props.setEditing(false);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit);
    }
  };

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
          {props.value}
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
