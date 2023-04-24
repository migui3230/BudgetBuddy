import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();

  const { user } = useUser();

  if (user) {
    router.push("/plaid");
  }

  const routeToSignIn = () => {
    if (user) {
      router.push("/plaid");
    } else {
      router.push("/sign-in");
    }
  };

  const routeToSignUp = () => {
    if (user) {
      router.push("/plaid");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#DDE2F9",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "800px",
          height: "500px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#7F92F9",
            display: "flex",
            padding: "40px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Prompt', sans-serif",
          }}
        >
          <div style={{ fontSize: "32px", textAlign: "center", color: "#fff" }}>
            Welcome to Budget Buddy!
          </div>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={routeToSignUp} style={{ width: "100%" }}>
              Sign up
            </Button>
            <div style={{ height: "10px" }}></div>
            <Button onClick={routeToSignIn} style={{ width: "100%" }}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
