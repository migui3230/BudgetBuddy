import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "@mantine/core";

export default function Home() {
  const router = useRouter();

  const routeToSignIn = () => {
    router.push("/sign-in");
  };

  const routeToSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <>
      <Button onClick={routeToSignUp}>Sign up</Button>
      <Button onClick={routeToSignIn}>Login</Button>
    </>
  );
}
