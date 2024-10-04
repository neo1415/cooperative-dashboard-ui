import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { Member, MembersDetails } from "@prisma/client";
// import { role, MembersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type MemberList = Member & {membersDetails:MembersDetails[]};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Surname",
    accessor: "surname",
    className: "hidden md:table-cell",
  },
  {
    header: "First Name",
    accessor: "firstName",
    className: "hidden md:table-cell",
  },
  {
    header: "Middle Name",
    accessor: "middleName",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Date of Entry",
  //   accessor: "dateOfEntry",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Telephone 1",
    accessor: "telephone1",
    className: "hidden md:table-cell",
  },
  {
    header: "Telephone 2",
    accessor: "telephone2",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Date of Birth",
  //   accessor: "dateOfBirth",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Sex",
    accessor: "sex",
    className: "hidden md:table-cell",
  },
  {
    header: "Marital Status",
    accessor: "maritalStatus",
    className: "hidden md:table-cell",
  },
  {
    header: "Occupation",
    accessor: "occupation",
    className: "hidden md:table-cell",
  },
  {
    header: "Business",
    accessor: "business",
    className: "hidden md:table-cell",
  },
  {
    header: "Residential Address",
    accessor: "residentialAddress",
    className: "hidden lg:table-cell",
  },
  // {
  //   header: "LGA",
  //   accessor: "lga",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "State",
  //   accessor: "state",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Permanent Home Address",
  //   accessor: "permanentHomeAddress",
  //   className: "hidden lg:table-cell",
  // },
  // {
  //   header: "State of Origin",
  //   accessor: "stateOfOrigin",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "LGA 2",
  //   accessor: "lga2",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Amount Paid",
  //   accessor: "amountPaid",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Next of Kin Name",
  //   accessor: "nextOfKinName",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Next of Kin Phone 1",
  //   accessor: "nextOfKinPhone",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Next of Kin Phone 2",
  //   accessor: "nextOfKinPhone2",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Sponsor",
  //   accessor: "sponsor",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = (item: MemberList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      {/* <Image
        src={item.img}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      /> */}
      <div className="flex flex-col">
       
      

       
        {/* <p className="text-xs text-gray-500">{item.dateOfBirth}</p> */}

      </div>
    </td>
    <td className="hidden md:table-cell">
      {/* {item.membersDetails.map((details) => details.dateOfEntry)} */}
    </td>
    <td className="hidden md:table-cell">
    {/* {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.dateOfEntry).join(", ")
      : "N/A"} Handle case when membersDetails is not available */}
       <h3 className="font-semibold">{item.surname}</h3>
  </td>
  <td className="hidden md:table-cell">
    {/* {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.telephone1).join(", ")
      : "N/A"} */}
       <p className="text-xs text-gray-500">{item.firstName}</p>
  </td>
  <td className="hidden md:table-cell">
    {/* {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.telephone2).join(", ")
      : "N/A"} */}
             <p className="text-xs text-gray-500">{item.middleName}</p>
  </td>
  <td className="hidden md:table-cell">
    {/* {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.maritalStatus).join(", ")
      : "N/A"} */} <p className="text-xs text-gray-500">{item.email}</p>
  </td>
  <td className="hidden md:table-cell">
    {/* {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.occupation).join(", ")
      : "N/A"} */}         <p className="text-xs text-gray-500">{item.sex}</p>
  </td>
  <td className="hidden md:table-cell">
    {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.business).join(", ")
      : "N/A"}
  </td>
  <td className="hidden md:table-cell">
    {Array.isArray(item.membersDetails) && item.membersDetails.length > 0
      ? item.membersDetails.map((details) => details.residentialAddress).join(", ")
      : "N/A"}
  </td>
    {/* <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.lga)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.state)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.permanentHomeAddress)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.stateOfOrigin)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.lga2)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.amountPaid)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.nextOfKinName)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.nextOfKinPhone)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.nextOfKinPhone2)}
    </td>
    <td className="hidden md:table-cell">
      {item.membersDetails.map((details) => details.sponsor)}
    </td> */}
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/Members/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {/* {role === "admin" && (
          // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
          //   <Image src="/delete.png" alt="" width={16} height={16} />
          // </button>
          // <FormModal table="student" type="delete" id={item.id}/>
        )} */}
      </div>
    </td>
  </tr>
);

const MembersListPage =async () => {

const data=await prisma.member.findMany()



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Members</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {/* {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              // <FormModal table="student" type="create"/>
            )} */}
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

export default MembersListPage;