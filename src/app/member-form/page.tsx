"use client";
// import dynamic from "next/dynamic";
import KYCForm from "../../components/forms/KYCForm";

// Lazy load the forms
// const KYCForm = dynamic(() => import("./forms/KYCForm"), {
//   loading: () => <h1>Loading...</h1>,
// });

const KYCFormPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-md">
        {/* Render your KYC form here */}
        <KYCForm />
      </div>
    </div>
  );
};

export default KYCFormPage;
