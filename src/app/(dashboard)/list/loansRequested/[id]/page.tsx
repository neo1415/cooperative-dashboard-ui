// src/app/(dashboard)/list/loansRequested/[id]/page.tsx
"use client";

import LoanRequestDetail from "./LoanRequestDetail";


export default function Page({ params }: { params: { id: string } }) {
  return <LoanRequestDetail loanId={params.id} onClose={() => {}} />;
}
