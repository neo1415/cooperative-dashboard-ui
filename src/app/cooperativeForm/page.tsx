"use client";

import CooperativeForm from "../../components/forms/CooperativeForm";


const CooperativeFormPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-md">
        {/* Render your KYC form here */}
        <CooperativeForm />
      </div>
    </div>
  );
};

export default CooperativeFormPage;
