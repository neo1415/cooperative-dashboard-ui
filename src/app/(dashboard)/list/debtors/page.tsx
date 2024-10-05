// //import FormModal from "@/components/FormModal";
//import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { debtorsData, role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Debtors = {
  id: number;
  memberId: string;
  surname:          string
  firstName:         string
  middleName:        string
  cooperative: string
  dateLoanRecieved: string
  noOfMonths: string[];
  membersCapital: string
  ordinarySavings: string
  specialSavings: string
  memberLoan: string
  interestOnLoan: string
  photo: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Debtor ID",
    accessor: "memberId",
    className: "hidden md:table-cell",
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
  {
    header: "Cooperative",
    accessor: "cooperative",
    className: "hidden md:table-cell",
  },
  {
    header: "Date Of Loan Recieved",
    accessor: "dateLoanRecieved",
    className: "hidden md:table-cell",
  },
  {
    header: "Number of Months",
    accessor: "noOfMonths",
    className: "hidden md:table-cell",
  },
  {
    header: "Members Capital",
    accessor: "membersCapital",
    className: "hidden md:table-cell",
  },
  {
    header: "Ordinary Savings",
    accessor: "ordinarySavings",
    className: "hidden md:table-cell",
  },
  {
    header: "Special Savings",
    accessor: "specialSavings",
    className: "hidden md:table-cell",
  },
  {
    header: "Members Loan",
    accessor: "memberLoan",
    className: "hidden md:table-cell",
  },
  {
    header: "Interest on Loan",
    accessor: "interestOnLoan",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const LoanListPage = () => {
  const renderRow = (item: Debtors) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt="item-photo"
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.memberId}</h3>
          <p className="text-xs text-gray-500">{item?.surname}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.firstName}</td>
      <td className="hidden md:table-cell">{item.middleName}</td>
      <td className="hidden md:table-cell">{item.cooperative}</td>
      <td className="hidden md:table-cell">{item.dateLoanRecieved}</td>
      <td className="hidden md:table-cell">{item.noOfMonths}</td>
      <td className="hidden md:table-cell">{item.membersCapital}</td>
      <td className="hidden md:table-cell">{item.ordinarySavings}</td>
      <td className="hidden md:table-cell">{item.specialSavings}</td>
      <td className="hidden md:table-cell">{item.memberLoan}</td>
      <td className="hidden md:table-cell">{item.interestOnLoan}</td>
      {/* <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td> */}
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/debtors/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {/* {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="teacher" type="delete" id={item.id}/>
          )} */}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Debtors</h1>
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
              <FormModal table="teacher" type="create"/>
            )} */}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={debtorsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default LoanListPage;