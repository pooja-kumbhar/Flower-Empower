import {
  UsersIcon,
  FaceSmileIcon,
  CheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import API from "../axios";

function Stats() {
  const { data: home } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await API.get("home/", {});
      return res.data;
    },
  });

  const stats = [
    {
      id: 1,
      name: "Number of volunteers",
      stat: home?.total_volunteers,
      icon: UsersIcon,
    },
    {
      id: 2,
      name: "Total number of bouquets delivered",
      stat: home?.total_bouquets,
      icon: CheckIcon,
    },
    {
      id: 3,
      name: "Flower recipients",
      stat: home?.total_recipients,
      icon: FaceSmileIcon,
    },
    {
      id: 4,
      name: "Total volunteer hours",
      stat: home?.total_hours,
      icon: ClockIcon,
    },
  ];
  console.log(home);
  return (
    <div className="lg:mt-40 lg:mb-36 md:mt-30 md:mb-30 mt-20  pb-20 mb-10">
      <h2 className="text-center text-3xl mb-24 font-bold ">
        What we have achieved so far
      </h2>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4  pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-[#e48dde] p-3">
                <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default Stats;
