import { useState } from "react";
import VolunteerDeleteModal from "./VolunteerDeleteModal";
import VolunteerEditModal from "./VolunteerEditModal";

/* eslint-disable react/prop-types */
function VolunteerRow({ user }) {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  return (
    <tr key={user.email}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {user.first_name} {user.last_name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {user.email}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {user.phone}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {user.hours}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {user.preferred_communication === "none"
          ? "Not specified yet"
          : user.preferred_communication}
      </td>

      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
        <div className="flex gap-x-4 justify-end">
          <button
            onClick={() => {
              setEditClicked((prev) => !prev);
            }}
            className="py-0.5 px-2 rounded-lg bg-[#e48dde] hover:bg-[#d973d2] text-white "
          >
            Edit
          </button>
          <button
            onClick={() => {
              setDeleteClicked((prev) => !prev);
            }}
            className=" text-black  hover:text-slate-700"
          >
            Delete
          </button>
          {deleteClicked && (
            <VolunteerDeleteModal
              setDeleteClicked={setDeleteClicked}
              userId={user.id}
            />
          )}
          {editClicked && (
            <VolunteerEditModal
              setEditClicked={setEditClicked}
              userId={user.id}
              currUser={user}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default VolunteerRow;
