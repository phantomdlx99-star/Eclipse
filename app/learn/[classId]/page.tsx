import React from "react";

const page = async ({ params }: { params: Promise<{ classId: string }> }) => {
  const { classId } = await params;

  return <div>This is for {classId}</div>;
};

export default page;
