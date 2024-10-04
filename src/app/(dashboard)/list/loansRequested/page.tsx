// import FormModal from "@/components/FormModal";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { debtorsData, role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type LoansRequested = {
  id: number;
  membersNo: string;
  surname:               string
  firstName:             string
  middleName:            string
  amountRequired: string;
  purposeOfLoan: string;
  dateOfApplication: string;
  durationOfLoan: string;
  balanceInTheSavingsAccount: string;
  bvnNumber: string;
  nameOfSurety1: string;
  surety1MenbersNo: string;
  surety1telephone: string
  surety1balanceInTheSavingsAccount: string
  nameOfSurety2: string;
  surety2MenbersNo: string;
  surety2telephone: string
  surety2balanceInTheSavingsAccount: string
  amountGuaranteed: string
  paymentVoucherNO: string
  amountGranted: string
  loanInterest: string;
  repaymentsPrincipal: string;
  repaymentInterest: string;
  balanceOutstandingPrincipal: string;
  balanceOutstandingInterest: string;
  balanceOutstandingTotal: string;
  approved: boolean;
  rejected: boolean
  pending: boolean
  cooperative: string
  // phone: string;
  // loanDate: string[];
  // noOfMonths: string[];
  // address: string;
  // interest:string,
  photo: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Members Number",
    accessor: "membersNo",
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
    header: "Amount Required",
    accessor: "amountRequired",
    className: "hidden md:table-cell",
  },
  {
    header: "Purpose Of Loan",
    accessor: "purposeOfLoan",
    className: "hidden md:table-cell",
  },
  {
    header: "Date Of Application",
    accessor: "dateOfApplication",
    className: "hidden md:table-cell",
  },
  {
    header: "Duration of Loan",
    accessor: "durationOfLoan",
    className: "hidden md:table-cell",
  },
  {
    header: "Balance In the Savings count",
    accessor: "balanceInTheSavingsAccount",
    className: "hidden md:table-cell",
  },
  {
    header: "BVN Number",
    accessor: "bvnNumber",
    className: "hidden md:table-cell",
  },
  {
    header: "Name Of Surety",
    accessor: "nameofSurety1",
    className: "hidden md:table-cell",
  },
  {
    header: "Surety Members Number",
    accessor: "surety1MembersNo",
    className: "hidden md:table-cell",
  },
  {
    header: "Surety Telephone",
    accessor: "surety1Telephone",
    className: "hidden md:table-cell",
  },
  {
    header: "Surety Balance In the Savings Account",
    accessor: "surety1balanceInTheavingsAccount",
    className: "hidden md:table-cell",
  },
  {
    header: "Name Of Surety",
    accessor: "nameofSurety2",
    className: "hidden md:table-cell",
  },
  {
    header: "Surety Members Number",
    accessor: "surety2MembersNo",
    className: "hidden md:table-cell",
  },
  {
    header: "Surety Telephone",
    accessor: "surety2Telephone",
    className: "hidden md:table-cell",
  },
  {
    header: "Surety Balance In the Savings Account",
    accessor: "surety2balanceInTheavingsAccount",
    className: "hidden md:table-cell",
  },
  {
    header: "Amount Guaranteed",
    accessor: "amountGuaranteed",
    className: "hidden lg:table-cell",
  },
  {
    header: "Payment Voucher Number",
    accessor: "paymentVoucherNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Amount Granted",
    accessor: "amountGranted",
    className: "hidden lg:table-cell",
  },
  {
    header: "Loan Interest",
    accessor: "loanInterest",
    className: "hidden lg:table-cell",
  },
  {
    header: "Repayment Principal",
    accessor: "repaymentPrincipal",
    className: "hidden lg:table-cell",
  },
  {
    header: "Repayments Interest",
    accessor: "repaymentInterest",
    className: "hidden lg:table-cell",
  },
  {
    header: "Balance Outstanding Principal",
    accessor: "balanceOutstandingPrincipal",
    className: "hidden lg:table-cell",
  },
  {
    header: "Balance Outstanding Interest",
    accessor: "balanceOutstandingInterest",
    className: "hidden lg:table-cell",
  },
  {
    header: "Balance Outstanding Total",
    accessor: "balanceOutstandingTotal",
    className: "hidden lg:table-cell",
  },


  {
    header: "Approved",
    accessor: "approved",
    className: "hidden lg:table-cell",
  },
  {
    header: "Rejected",
    accessor: "rejected",
    className: "hidden lg:table-cell",
  },
  {
    header: "Pending",
    accessor: "pending",
    className: "hidden lg:table-cell",
  },
  {
    header: "Cooperative",
    accessor: "cooperative",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const LoanRequestedPage = () => {
  const renderRow = (item: LoansRequested) => (
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
          <h3 className="font-semibold">{item.membersNo}</h3>
          <p className="text-xs text-gray-500">{item?.surname}</p>
          <p className="text-xs text-gray-500">{item?.firstName}</p>
          <p className="text-xs text-gray-500">{item?.middleName}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.amountRequired}</td>
      <td className="hidden md:table-cell">{item.purposeOfLoan}</td>
      <td className="hidden md:table-cell">{item.dateOfApplication}</td>
      <td className="hidden md:table-cell">{item.durationOfLoan}</td>
      <td className="hidden md:table-cell">{item.balanceInTheSavingsAccount}</td>
      <td className="hidden md:table-cell">{item.bvnNumber}</td>
      <td className="hidden md:table-cell">{item.nameOfSurety1}</td>
      <td className="hidden md:table-cell">{item.surety1MenbersNo}</td>
      <td className="hidden md:table-cell">{item.surety1telephone}</td>
      <td className="hidden md:table-cell">{item.surety1balanceInTheSavingsAccount}</td>
      <td className="hidden md:table-cell">{item.nameOfSurety2}</td>
      <td className="hidden md:table-cell">{item.surety2MenbersNo}</td>
      <td className="hidden md:table-cell">{item.surety2telephone}</td>
      <td className="hidden md:table-cell">{item.surety2balanceInTheSavingsAccount}</td>
      <td className="hidden md:table-cell">{item.amountGuaranteed}</td>
      <td className="hidden md:table-cell">{item.paymentVoucherNO}</td>
      <td className="hidden md:table-cell">{item.amountGranted}</td>
      <td className="hidden md:table-cell">{item.loanInterest}</td>
      <td className="hidden md:table-cell">{item.repaymentInterest}</td>
      <td className="hidden md:table-cell">{item.repaymentsPrincipal}</td>
      <td className="hidden md:table-cell">{item.balanceOutstandingPrincipal}</td>
      <td className="hidden md:table-cell">{item.balanceOutstandingInterest}</td>
      <td className="hidden md:table-cell">{item.balanceOutstandingTotal}</td>
      <td className="hidden md:table-cell">{item.approved}</td>
      <td className="hidden md:table-cell">{item.rejected}</td>
      <td className="hidden md:table-cell">{item.pending}</td>
      <td className="hidden md:table-cell">{item.cooperative}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/debtors/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="loan" type="delete" id={item.id}/>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Requested Loans</h1>
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
              <FormModal table="loan" type="create"/>
            )}
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

export default LoanRequestedPage;