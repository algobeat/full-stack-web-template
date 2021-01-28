import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/molecules/Copyright";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUserMutation } from "../api/mutations/register";
import environment from "../relayEnvironment";
import { useSnackbar } from "notistack";
import {
  validateEmail,
  validatePassword,
} from "../../server/src/validation/user.validation";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, errors, watch } = useForm();
  const history = useHistory();

  const onSubmit = async (data: any) => {
    try {
      const result = await registerUserMutation(
        environment,
        data.email,
        data.name,
        data.password
      );

      if (result.signupUser?.success) {
        enqueueSnackbar("Successfully signed up! You may log in now.", {
          variant: "success",
        });
        history.push("/auth/login/");
      } else {
        enqueueSnackbar(
          "Error registering user: " + result.signupUser?.message,
          {
            variant: "error",
          }
        );
      }
    } catch (e) {
      enqueueSnackbar("Error registering user: " + e.message, {
        variant: "error",
      });
    }
  };

  const validateConfirmPassword = (data: string) => {
    if (data !== watch("password")) {
      return "Password does not match";
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                error={!!errors.name}
                autoFocus
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                error={!!errors.email}
                autoComplete="email"
                type={"email"}
                inputRef={register({ required: true, validate: validateEmail })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                inputRef={register({
                  required: true,
                  validate: validatePassword,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                type="password"
                id="confirmPassword"
                inputRef={register({
                  required: true,
                  validate: validateConfirmPassword,
                })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit(onSubmit)}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/auth/login/" variant="body2" component={RouterLink}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
