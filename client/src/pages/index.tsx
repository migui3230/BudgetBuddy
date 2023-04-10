import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
    <>
      <Button onClick={routeToSignUp}>Sign up</Button>
      <Button onClick={routeToSignIn}>Login</Button>
    </>
  );
}
