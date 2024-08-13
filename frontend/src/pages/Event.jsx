import { useQuery } from "@tanstack/react-query";
import EventTable from "../components/event/EventTable";
import API from "../axios";
import { useCookies } from "react-cookie";

function Event() {
  const [cookies] = useCookies(["user"]);
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await API.get("events/", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
  });
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await API.get("user/me/", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
  });
  return <EventTable user={user} events={events} />;
}

export default Event;
