import { Suspense } from "react";
import SuccessPageContent from "./success-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
