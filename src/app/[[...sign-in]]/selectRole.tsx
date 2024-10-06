// // app/signup/SelectRole.tsx (Client Component)
// "use client";

// import { useRouter } from 'next/navigation';

// const SelectRole = () => {
//   const router = useRouter();

//   const handleSelection = (role: string) => {
//     if (role === 'member') {
//       router.push('/member-sign-up'); // Redirect to member signup page
//     } else {
//       router.push('/cooperative-sign-up'); // Redirect to cooperative signup page
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-lamaSkyLight">
//       {/* <h1 className="text-xl font-bold mb-4">Sign up as a</h1> */}
//       <button
//         onClick={() => handleSelection('member')}
//         className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] w-60"
//       >
//         Member
//       </button>
//       <button
//         onClick={() => handleSelection('cooperative')}
//         className="bg-green-500 text-white my-1 rounded-md text-sm p-[10px] w-60"
//       >
//         Cooperative
//       </button>
//     </div>
//   );
// };

// export default SelectRole;
