import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, cooperativeData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Cooperative, Member } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type CooperativeList = Cooperative

const columns = [

    {
    header: "Cooperative Name",
    accessor: "cooperativeName",
    className: "hidden md:table-cell",
  },
  {
    header: "ID",
    accessor: "id",
  },

  {
    header: "Registration Number",
    accessor: "registrationNumber",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Date of Incorporation",
  //   accessor: "dateOfIncorporation",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden lg:table-cell",
  },
  {
    header: "Phone Number",
    accessor: "phoneNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Total Savings",
    accessor: "totalSavings",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Debt",
    accessor: "totalDebt",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Loans Requested",
    accessor: "totalLoansRequested",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Loans Approved",
    accessor: "totalLoansApproved",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Profit",
    accessor: "totalProfit",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Director Name",
  //   accessor: "directorName",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Position",
  //   accessor: "directorPosition",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Email",
  //   accessor: "directorEmail",
  //   className: "hidden lg:table-cell",
  // },
  // {
  //   header: "Director Phone Number",
  //   accessor: "directorPhoneNumber",
  //   className: "hidden lg:table-cell",
  // },
  // {
  //   header: "Director Date of Birth",
  //   accessor: "directorDateOfBirth",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Place of Birth",
  //   accessor: "directorPlaceOfBirth",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Nationality",
  //   accessor: "directorNationality",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Occupation",
  //   accessor: "directorOccupation",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director BVN Number",
  //   accessor: "directorBVNNumber",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director ID Type",
  //   accessor: "directorIDType",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director ID Number",
  //   accessor: "directorIDNumber",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Issued Date",
  //   accessor: "directorIssuedDate",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Expiry Date",
  //   accessor: "directorExpiryDate",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Director Source of Income",
  //   accessor: "directorSourceOfIncome",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Created At",
  //   accessor: "createdAt",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = (item: CooperativeList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      {/* <Image
        src={item.photo}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      /> */}
      <div className="flex flex-col">
      {/* <td className="hidden md:table-cell">{item.cooperativeId}</td> */}
        <h3 className="font-semibold">{item.cooperativeName}</h3>
        {/* <p className="text-xs text-gray-500">{item.createdAt}</p> */}
      </div>
    </td>
  
    <td className="hidden md:table-cell">{item.id}</td>
<td className="hidden md:table-cell">{item.registrationNumber}</td>
{/* <td className="hidden md:table-cell">{item.dateOfIncorporation}</td> */}
<td className="hidden md:table-cell">{item.address}</td>
<td className="hidden md:table-cell">{item.email}</td>
<td className="hidden md:table-cell">{item.phoneNumber}</td>
<td className="hidden md:table-cell">{item.totalSavings}</td>
<td className="hidden md:table-cell">{item.totalDebt}</td>
<td className="hidden md:table-cell">{item.totalLoansRequested}</td>
<td className="hidden md:table-cell">{item.totalLoansApproved}</td>
<td className="hidden md:table-cell">{item.totalProfit}</td>
{/* <td className="hidden md:table-cell">{item.directorName}</td>
<td className="hidden md:table-cell">{item.directorPosition}</td>
<td className="hidden md:table-cell">{item.directorEmail}</td>
<td className="hidden md:table-cell">{item.directorPhoneNumber}</td> */}
{/* <td className="hidden md:table-cell">{item.directorDateOfBirth}</td> */}
{/* <td className="hidden md:table-cell">{item.directorPlaceOfBirth}</td>
<td className="hidden md:table-cell">{item.directorNationality}</td>
<td className="hidden md:table-cell">{item.directorOccupation}</td>
<td className="hidden md:table-cell">{item.directorBVNNumber}</td>
<td className="hidden md:table-cell">{item.directorIDType}</td>
<td className="hidden md:table-cell">{item.directorIDNumber}</td>
<td className="hidden md:table-cell">{item.directorIssuedDate}</td>
<td className="hidden md:table-cell">{item.directorExpiryDate}</td>
<td className="hidden md:table-cell">{item.directorSourceOfIncome}</td> */}
{/* <td className="hidden md:table-cell">{item.createdAt}</td> */}
   
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/cooperatives/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {/* {role === "admin" && (
          // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
          //   <Image src="/delete.png" alt="" width={16} height={16} />
          // </button>
          // <FormModal table="cooperative" type="delete" id={item.id}/>
        )} */}
      </div>
    </td>
  </tr>
);



const CooperativeListPage = async () => {

const data= await prisma.cooperative.findMany()

console.log(data)

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Cooperatives</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal table="cooperative" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default CooperativeListPage;