import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  const { loginWithToken } = useAuth();

  const executed = useRef(false);

  useEffect(() => {
    // Prevent React StrictMode from executing twice
    if (executed.current) {
      return;
    }

    executed.current = true;

    const handleLogin = async () => {
      try {
        console.log("=================================");
        console.log("OAUTH SUCCESS PAGE");
        console.log("=================================");

        // Get JWT from URL
        const params = new URLSearchParams(
          window.location.search
        );

        const token = params.get("token");
        const error = params.get("error");

        console.log(
          "FULL URL :",
          window.location.href
        );

        console.log(
          "JWT RECEIVED :",
          token ? "YES" : "NO"
        );

        if (error) {
          console.error("OAUTH ERROR :", error);
          window.history.replaceState(
            {},
            document.title,
            "/oauth-success"
          );
          navigate("/", {
            replace: true,
            state: {
              authError: error,
            },
          });
          return;
        }

        if (!token) {
          console.error(
            "JWT TOKEN NOT FOUND"
          );

          navigate("/", {
            replace: true,
          });

          return;
        }

        // -------------------------------------------------
        // LOGIN WITH JWT
        // -------------------------------------------------

        console.log(
          "CALLING BACKEND USER API..."
        );

        const result = await loginWithToken(token);

        console.log(
          "LOGIN RESULT :",
          result
        );

        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        if (result?.success) {
          console.log(
            "GOOGLE AUTHENTICATION SUCCESS"
          );

          console.log(
            "USER :",
            result.user
          );

          // Remove token from browser URL
          window.history.replaceState(
            {},
            document.title,
            "/oauth-success"
          );

          // Go to dashboard
          navigate("/dashboard", {
            replace: true,
          });

          return;
        }

        throw new Error(
          "Google authentication failed"
        );
      } catch (error) {
        console.error(
          "GOOGLE AUTHENTICATION FAILED :",
          error
        );

        // Clear OAuth URL
        window.history.replaceState(
          {},
          document.title,
          "/oauth-success"
        );

        navigate("/", {
          replace: true,
        });
      }
    };

    handleLogin();
  }, [loginWithToken, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2>
        Signing you in...
      </h2>

      <p>
        Completing Google authentication...
      </p>
    </div>
  );
}
