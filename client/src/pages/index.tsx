import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/plaid");
  });

  return null;
}
