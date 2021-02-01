import { logoutMutation } from "../../api/mutations/logout";
import environment from "../../relayEnvironment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import * as React from "react";

export default function LogoutConfirmationModal(props: {
  open: boolean;
  setOpen: (val: boolean) => any;
}) {
  const handleLogout = async () => {
    await logoutMutation(environment);
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>{"Logging out"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="primary">
          Yes
        </Button>
        <Button onClick={handleClose} color="default" autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
