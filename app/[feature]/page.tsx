const page = async ({ params }: { params: Promise<{ feature: string }> }) => {
  const { feature } = await params;
  return (
    <div className="font-display">
      <h1 className="text-3xl bg-clip-text bg-linear-60 from-primary to-cyan-300 text-center">
        You can track your previous performance here!
      </h1>
      <h2 className="text-xl text-center font-bold text-gray-400">
        Select the previous quiz from the sidebar
      </h2>
    </div>
  );
};

export default page;
