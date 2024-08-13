import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import API from "../../axios";
import toast from "react-hot-toast";
import ModalEventDelete from "./ModalEventDelete";
import EditEventModal from "./EditEventModal";
import Closed from "./Closed";
import Open from "./Open";

/* eslint-disable react/prop-types */
function EventRow({ event, user }) {
  console.log(event);
  const navigate = useNavigate();
  const [isBouquet, setIsBouquet] = useState(
    event?.bouquet_makers.includes(user?.id)
  );
  const [isDriver, setIsDriver] = useState(event?.drivers.includes(user?.id));
  const [cookies] = useCookies(["user"]);
  const [role, setRole] = useState("");
  const [eventId, setEventId] = useState(null);
  const [currEvent, setCurrEvent] = useState(null);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);

  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const { mutate } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.patch(
        `events/toggle-participation/${eventId}/`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });

      toast.success(data.message);
    },
    onError: () => {
      toast.error("Oh no, retry :(");
    },
  });

  function onSubmit(data) {
    mutate({ ...data, role });
  }
  function handleEventClick(id) {
    navigate(`${id}`);
  }

  return (
    <>
      <tr key={event.date} className={``}>
        <td
          onClick={() => {
            if (cookies.issuperuser) {
              handleEventClick(event.id);
            }
          }}
          className={`${
            cookies.issuperuser ? "cursor-pointer hover:bg-slate-100" : ""
          } whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0`}
        >
          {event.date}
        </td>
        {cookies.issuperuser ? (
          <>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {event.bouquet_makers.length} / {event.bouquet_makers_needed}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {event.drivers.length} / {event.drivers_needed}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {event.group}
            </td>
          </>
        ) : null}
        {cookies.issuperuser ? (
          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
            <div className="flex gap-x-2 justify-end">
              {event.closed ? (
                <Closed event={event} cookies={cookies.token} />
              ) : (
                <Open event={event} cookies={cookies.token} />
              )}
              {event.closed ? (
                <p className="text-slate-500 ml-7">Event closed</p>
              ) : (
                <div className="flex gap-x-4 justify-end items-center">
                  <button
                    onClick={() => {
                      setEventId(event.id);
                      setCurrEvent(event);

                      setEditClicked((prev) => !prev);
                    }}
                    className="py-0.5 px-2 ml-4  rounded-lg bg-[#e48dde] hover:bg-[#d973d2] text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setEventId(event.id);
                      setDeleteClicked((prev) => !prev);
                    }}
                    className="text-slate-900 hover:text-slate-700 "
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </td>
        ) : (
          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
            <div className="flex gap-x-2 justify-end">
              {event.closed ? (
                <p className="text-slate-500">Event closed</p>
              ) : (
                <>
                  <form
                    className="flex gap-x-2"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex gap-x-2">
                      <p className="text-gray-800">Bouquet maker</p>

                      <Switch
                        checked={isBouquet}
                        name="role"
                        value="bouquet_maker"
                        onChange={() => {}}
                        onClick={() => {
                          setRole("bouquet_maker");
                          setEventId(event.id);
                          setIsBouquet((prev) => !prev);
                          if (isDriver) setIsDriver(false);
                        }}
                        className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute h-full w-full rounded-md bg-white"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out group-data-[checked]:bg-indigo-600"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                        <input
                          type="hidden"
                          name="role"
                          value="bouquet_maker"
                          {...register("role")}
                        />
                      </Switch>
                    </div>
                    <div className="flex gap-x-1">
                      <p className="text-gray-800">Driver</p>
                      <Switch
                        name="role"
                        value="driver"
                        checked={isDriver}
                        onChange={() => {}}
                        onClick={() => {
                          setRole("driver");
                          setEventId(event.id);
                          setIsDriver((prev) => !prev);
                          if (isBouquet) setIsBouquet(false);
                        }}
                        className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute h-full w-full rounded-md bg-white"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out group-data-[checked]:bg-indigo-600"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                        <input
                          type="hidden"
                          name="role"
                          {...register("role")}
                        />
                      </Switch>
                      <div className="ml-4 flex items-center justify-start">
                        <button
                          className="bg-[#e48dde]  text-white py-0.5 px-2 hover:bg-[#d973d2] rounded-xl"
                          type="submit"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </td>
        )}
      </tr>
      {deleteClicked && (
        <ModalEventDelete
          setDeleteClicked={setDeleteClicked}
          eventId={eventId}
        />
      )}
      {editClicked && (
        <EditEventModal
          setEditClicked={setEditClicked}
          eventId={eventId}
          currEvent={currEvent}
        />
      )}
    </>
  );
}

export default EventRow;
