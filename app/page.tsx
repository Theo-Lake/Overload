"use client";

import Image from "next/image";
import Scheduler from "./components/Scheduler/Scheduler";
import LUchat_Icon from "./components/LUchat/Icon/LUchat_Icon";
import LUchat from "./components/LUchat/Chat/LUchat";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Scheduler />
      {open ? (
        <LUchat onMinimize={() => setOpen(false)} />
      ) : (
        <LUchat_Icon onClick={() => setOpen(true)} />
      )}
    </>
  );
}
