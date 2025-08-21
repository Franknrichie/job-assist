import { useEffect, useState, useCallback } from "react";
import SignUpModal from "./SignUpModal";
import SignInModal from "./SignInModal";

export default function AuthModalsHost() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const openSignUp = useCallback(() => {
    setShowSignIn(false);
    setShowSignUp(true);
  }, []);

  const openSignIn = useCallback(() => {
    setShowSignUp(false);
    setShowSignIn(true);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const raw = e?.detail;
      const which =
        typeof raw === "string"
          ? raw
          : raw && typeof raw.which === "string"
          ? raw.which
          : "";
      const key = which.toLowerCase();
      if (key === "signup") openSignUp();
      if (key === "signin") openSignIn();
    };

    document.addEventListener("auth:open", handler);
    return () => document.removeEventListener("auth:open", handler);
  }, [openSignIn, openSignUp]);

  return (
    <>
      <SignUpModal
        show={showSignUp}
        handleClose={() => setShowSignUp(false)}
        onOpenSignIn={openSignIn}
      />
      <SignInModal
        show={showSignIn}
        handleClose={() => setShowSignIn(false)}
      />
    </>
  );
}
