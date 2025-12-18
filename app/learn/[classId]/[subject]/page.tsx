"use client";

import React from "react";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const { subject } = params;
  return <div>This is for the {subject}</div>;
};

export default page;
