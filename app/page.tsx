"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const r = useRouter();
  useEffect(() => {
    const authed = localStorage.getItem("authed") === "1";
    r.replace(authed ? "/dashboard" : "/login");
  }, [r]);
  return null;
}
