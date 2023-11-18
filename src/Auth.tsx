import React, { useState } from "react";
import { supabase } from "./config/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

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

  return (
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
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * import React, { useRef, useState } from "react";
import { Alert, Button, Card, Input } from "antd";
import { supabase } from "./supabaseClient";

export const LoginPage = () => {
  const mobileNoRef = useRef<string>("");
  const otpRef = useRef<string>();
  const [error, setError] = useState<string>();
  const [formState, setFormState] = useState<"SEND_OTP" | "LOGIN">("SEND_OTP");

  const onLogin = async () => {
    const otp = otpRef.current || "";
    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Please enter a valid OTP");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: mobileNoRef.current,
    });
    if (error) {
      setError(error.message);
      return;
    }
  };

  const mobileFormRender = () => (
    <>
      <label className="text-dark font-medium">Enter your mobile mumber</label>
      <Input
        className="border-gray bg-gray text-dark mb-4 text-lg font-medium"
        onChange={(e) => (mobileNoRef.current = e.target.value)}
        onFocus={() => setError("")}
        name="mobile"
        type={"tel"}
        defaultValue={mobileNoRef.current}
      />
      <Button color="accent" className="shadow" onClick={onSendOtp}>
        Send OTP
      </Button>
    </>
  );

  const otpFormRender = () => (
    <>
      <label className="text-dark font-medium">Enter OTP</label>
      <Input
        className="border-gray bg-gray text-dark mb-4 text-lg font-medium"
        onChange={(e) => (otpRef.current = e.target.value)}
        onFocus={() => setError("")}
        name="otp"
        value={otpRef.current}
      />
      <Button color="accent" className="shadow" onClick={onLogin}>
        Login
      </Button>
    </>
  );

  const onSendOtp = async () => {
    const mobileNo = mobileNoRef.current || "";
    if (!/^\+[1-9]{1}[0-9]{3,14}$/.test(mobileNo)) {
      setError("Please enter a valid mobile number");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: mobileNo,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setFormState("LOGIN");
  };

  return (
    <div className="bg-primary flex min-h-screen items-center justify-center">
      <Card className="w-1/2 bg-white shadow-lg " bordered={false}>
        {error && <div>{error}</div>}
        <h2 className="text-dark mb-3  text-xl font-bold">Sign In</h2>
        {formState === "SEND_OTP" && mobileFormRender()}
        {formState === "LOGIN" && otpFormRender()}
      </Card>
    </div>
  );
};

export default LoginPage;

 */
