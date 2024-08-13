/* eslint-disable react/prop-types */
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import API from "../../axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader";
import { useCookies } from "react-cookie";
import VolunteerRow from "./VolunteerRow";

function VolunteerTable() {
  const [cookies] = useCookies(["user"]);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await API.get("user/", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
  });
  if (isLoading) return <Loader />;
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Volunteers
            </h1>

          </div>
        </div>
        {!users?.length ? (
          <p className="text-center mt-24">There are no volunteers yet</p>
        ) : (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        <a href="#" className="group inline-flex">
                          Name
                          <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="h-5 w-5"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <span className="group inline-flex">Email</span>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <span className="group inline-flex">Phone</span>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <span className="group inline-flex">Hours</span>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <span href="#" className="group inline-flex">
                          Preferred communication
                        </span>
                      </th>

                      <th scope="col" className="relative py-3.5 pl-3 pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users
                      ?.filter((user) => user.is_superuser != true)
                      .map((user, index) => (
                        <VolunteerRow key={index} user={user} />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VolunteerTable;
