import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/molecules/Copyright";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginMutation } from "../api/mutations/login";
import environment from "../relayEnvironment";
import { useSnackbar } from "notistack";
import { getDisplayName } from "../api/helpers/user.helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const onSubmit = async (data: any) => {
    try {
      const response = await loginMutation(
        environment,
        data.email,
        data.password,
        data.rememberMe
      );
      if (response.login?.success) {
        enqueueSnackbar(
          "Successfully signed in as " + getDisplayName(response.login.user),
          { variant: "success" }
        );
        history.push("/");
      } else {
        enqueueSnackbar("Problem signing in: " + response.login?.message, {
          variant: "error",
        });
      }
    } catch (e) {
      enqueueSnackbar("Problem signing in: " + e.message, { variant: "error" });
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              type={"email"}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={register({ required: true })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={register({ required: true })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  color="primary"
                  inputRef={register}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit(onSubmit)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  to="/auth/register"
                  variant="body2"
                  component={RouterLink}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
