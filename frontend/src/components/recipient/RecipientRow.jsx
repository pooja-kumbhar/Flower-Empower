import { useState } from "react";
import DeleteModal from "./DeleteModal";
import EditRecipientModal from "./EditRecipientModal";

/* eslint-disable react/prop-types */
function RecipientRow({ recipient }) {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  return (
    <tr key={recipient.address}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {recipient.first_name} {recipient.last_name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recipient.address}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recipient.city}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recipient.state}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recipient.zip}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recipient.end_date}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recipient.group}
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
            className=" text-black hover:text-slate-700 "
          >
            Delete
          </button>
          {deleteClicked && (
            <DeleteModal
              setDeleteClicked={setDeleteClicked}
              id={recipient.id}
            />
          )}
          {editClicked && (
            <EditRecipientModal
              setEditClicked={setEditClicked}
              id={recipient.id}
              currRecipient={recipient}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default RecipientRow;
