// app/products/loading.tsx
import { HashLoader } from "react-spinners";
export default function Loading() {
  // You can add any UI inside, including a Skeleton.
  return (
    <div className="flex items-center justify-center h-screen">
      <HashLoader color="#1e96dc" />
    </div>
  );
}
