/* eslint-disable react/prop-types */
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useCookies } from "react-cookie";
import ModalEvent from "./ModalEvent";
import EventRow from "./EventRow";

function EventTable({ user, events }) {
  const [cookies] = useCookies(["user"]);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      {isClicked && <ModalEvent setIsClicked={setIsClicked} />}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Events
            </h1>
          </div>
          {cookies.issuperuser ? (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => setIsClicked((prev) => !prev)}
                type="button"
                className="block rounded-md bg-[#e48dde] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#d973d2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create event
              </button>
            </div>
          ) : null}
        </div>
        {!events?.length ? (
          <p className="text-center mt-24">There are no events yet</p>
        ) : (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table
                  className={`${
                    cookies.issuperuser ? "min-w-full" : "min-w-full"
                  } divide-y
                divide-gray-300`}
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        <a href="#" className="group inline-flex">
                          Date
                          <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="h-5 w-5"
                            />
                          </span>
                        </a>
                      </th>
                      {cookies.issuperuser ? (
                        <>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            <a href="#" className="group inline-flex">
                              Bouquet makers
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
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            <a href="#" className="group inline-flex">
                              Drivers
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
                            <a href="#" className="group inline-flex">
                              Group
                              <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                <ChevronDownIcon
                                  aria-hidden="true"
                                  className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                />
                              </span>
                            </a>
                          </th>{" "}
                        </>
                      ) : null}

                      <th scope="col" className="relative py-3.5 pl-3 pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {events?.map((event, index) => (
                      <EventRow key={index} event={event} user={user} />
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

export default EventTable;
