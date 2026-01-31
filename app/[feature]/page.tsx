const page = async ({ params }: { params: Promise<{ feature: string }> }) => {
  const { feature } = await params;
  return <div>This is the page for {feature} </div>;
};

export default page;
