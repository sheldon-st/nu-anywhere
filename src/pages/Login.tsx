import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Button } from "antd";
import posthog from "posthog-js";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session from getSession");
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session from onAuthStateChange");
      setSession(session);
    });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  async function signInWithAzure() {
    posthog.capture("attempt sso login", { property: "sso attempted" });
    let redirectUrl = window.location.origin + "/register";

    // if process env is available and context is production, use https://nuanywhere.uiby.me/register (in dev mode process is undefined so check for that to avoid errors)
    try {
      if (process.env.NODE_ENV === "production") {
        redirectUrl = "https://nuanywhere.uiby.me/register";
      }
    } catch (err) {
      console.log(err);
    }

    console.log("redirectUrl");
    console.log(redirectUrl);

    const { data, error } = await supabase.auth
      .signInWithOAuth({
        provider: "azure",
        options: {
          scopes: "email profile offline_access",
          redirectTo: redirectUrl,
        },
      })
      .then(({ data, error }) => {
        console.log(data);
        console.log(error);
        if (session) {
          const { user } = session;
          console.log("user");
          console.log(user);
        }
        return { data, error };
      });
    // log profile
    console.log(data);

    // You can additionally extract the provider_token from the session (on initial login only) which is the OAuth 2.0 access token
  }

  useEffect(() => {
    console.log("session");
    if (session) {
      console.log("session");
      console.log(session);
    }
  }, [session]);

  return (
    <>
      {!session ? (
        <div className="row flex flex-center">
          <div className="col-6 form-widget">
            <h1 className="header">Supabase + React</h1>
            <p className="description">
              Sign in via magic link with your email below
            </p>
            <form className="form-widget" onSubmit={handleLogin}>
              <div>
                <input
                  className="inputField"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <button className={"button block"} disabled={loading}>
                  {loading ? (
                    <span>Loading</span>
                  ) : (
                    <span>Send magic link</span>
                  )}
                </button>
              </div>
            </form>
            <Button onClick={signInWithAzure}>Sign in with Azure</Button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Welcome</h1>
          <Button href="/login">Login</Button>
        </div>
      )}
    </>
  );
}

export default LoginPage;
