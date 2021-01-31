import { createFragmentContainer, RelayProp } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { ChangePasswordForm_user } from "./__generated__/ChangePasswordForm_user.graphql";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { validatePassword } from "../../api/validation/user.validation";
import Button from "@material-ui/core/Button";
import React from "react";
import { changePassword } from "../../api/mutations/changePassword";
import { useSnackbar } from "notistack";

interface ChangePasswordFormProps {
  relay: RelayProp;
  user: ChangePasswordForm_user | null;
}

const Form = styled.form`
  & > * {
      margin: ${({ theme }) => theme.spacing(1)},
      width: '25ch',
  }
`;

function ChangePasswordFormComponent(props: ChangePasswordFormProps) {
  const { register, handleSubmit, watch, errors } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const validateConfirmPassword = (data: string) => {
    if (data !== watch("newPassword")) {
      return "Password does not match";
    }
  };

  if (!props.user) {
    return <TextField>Loading...</TextField>;
  }

  const onSubmit = async (data: any) => {
    const result = await changePassword(
      props.relay.environment,
      props.user!.id,
      data.currentPassword,
      data.newPassword
    );
    if (!result.changePassword) {
      enqueueSnackbar("Could not update password: Network error", {
        variant: "error",
      });
    } else if (!result.changePassword.success) {
      enqueueSnackbar(
        "Could not update password: " + result.changePassword.message,
        { variant: "error" }
      );
    } else {
      enqueueSnackbar("Password successfully updated!", { variant: "success" });
    }
  };

  return (
    <Form noValidate autoComplete={"off"}>
      <div>
        <TextField
          type={"password"}
          label={"Current Password"}
          name={"currentPassword"}
          error={!!errors.password}
          helperText={errors.password?.message}
          inputRef={register}
        />
      </div>
      <div>
        <TextField
          type={"password"}
          label={"New Password"}
          name={"newPassword"}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          inputRef={register({ required: true, validate: validatePassword })}
        />
      </div>
      <div>
        <TextField
          type={"password"}
          label={"Confirm New Password"}
          name={"confirmPassword"}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          inputRef={register({
            required: true,
            validate: validateConfirmPassword,
          })}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
      >
        Update Password
      </Button>
    </Form>
  );
}

const ChangePasswordForm = createFragmentContainer(
  ChangePasswordFormComponent,
  {
    user: graphql`
      fragment ChangePasswordForm_user on User {
        id
      }
    `,
  }
);

export default ChangePasswordForm;
