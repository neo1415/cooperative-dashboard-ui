// import FormModal from "@/components/FormModal";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { assetTransferred, role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Assetstransferred = {
  id: number;
  assetId: string;
  assetName: string;
  price?: string;
  photo: string;
  seller: string;
  buyer: string;
//   transferred?: boolean;
  // noOfMonths: string[];
  shortDesc: string;
  longDesc: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Asset ID",
    accessor: "assetId",
    className: "hidden md:table-cell",
  },
  {
    header: "Asset Name",
    accessor: "assetName",
    className: "hidden md:table-cell",
  },
  {
    header: "Price",
    accessor: "price",
    className: "hidden md:table-cell",
  },
  {
    header: "Transferred",
    accessor: "transferred",
    className: "hidden md:table-cell",
  },
  {
    header: "Seller",
    accessor: "seller",
    className: "hidden lg:table-cell",
  },
  {
    header: "Buyer",
    accessor: "buyer",
    className: "hidden lg:table-cell",
  },
  {
    header: "Short Description",
    accessor: "shortDesc",
    className: "hidden lg:table-cell",
  },
  {
    header: "Long Description",
    accessor: "longDesc",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const assetstransferredListPage = () => {
  const renderRow = (item: Assetstransferred) => (
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
          <h3 className="font-semibold">{item.assetName}</h3>
          <p className="text-xs text-gray-500">{item?.price}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.assetId}</td>
      {/* <td className="hidden md:table-cell">{item.cooperat}</td> */}
      <td className="hidden md:table-cell">{item.price}</td>
      <td className="hidden md:table-cell">{item.seller}</td>
      <td className="hidden md:table-cell">{item.buyer}</td>
      <td className="hidden md:table-cell">{item.shortDesc}</td>
      <td className="hidden md:table-cell">{item.longDesc}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/assetsTransferred/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="teacher" type="delete" id={item.id}/>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Transferred Assets</h1>
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
              <FormModal table="teacher" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={assetTransferred} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default assetstransferredListPage;