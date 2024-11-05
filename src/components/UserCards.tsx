import Image from "next/image";

interface UserCardProps {
  type: string;
  value: number; // Assuming all values are numbers
}

const UserCard = ({ type, value }: { type: string; value?: number | null }) => {
  return (
    <div className="rounded-2xl odd:bg-neoPurple even:bg-neoYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-500">2024/25</span>
        <Image src="/more.png" alt="card-icon" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">
        {value !== null && value !== undefined ? value.toLocaleString() : 'N/A'}
      </h1>
      <h2 className="capitalize text-gray-500 text-sm font-medium">{type}</h2>
    </div>
  );
};

export default UserCard;
