/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../axios";
import Loader from "../Loader";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function BouquetEmail({ event, evId, token }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.post(`events/sendbouquetemail/${evId}/`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });

      toast.success(`Emails to bouquet makers sent successfully!`);
    },
    onError: () => {
      toast.error("Oh no, retry :(");
    },
  });

  function onSubmit(data) {
    mutate({
      ...data,
      body: `
      Hi,
      
      I have you signed up for this weekend to make bouquets. If you have any last minute changes, please text me at 
      805-689-6431 to let me know. THANK YOU as always! Looking forward to seeing you.
         
      Here are a few reminders and the FE volunteer video (https://www.youtube.com/watch?v=ytF7e8YuUyo) in case you need a refresher:
      
      1. Table Sharing: Each table is designed for 2-3 people to work together. Sometimes we may have fewer volunteers,
       and a table might have just one person. Let's take this as an opportunity to connect and meet someone new!
      
      2. Priority for Recipients: Remember, our primary focus is on the recipients. Please ensure that they receive their 
      flowers first, before volunteers take any extras.
      
      3. Sharing Flowers: If someone comes to your table asking for flowers, please consider sharing. Requests usually 
      mean someone is in need of something to spruce up a bouquet, and your kindness can make a big difference.

      4. Stay to Clean Up: We appreciate everyone's help in cleaning up after the event. If you're unable to stay until 
      the end, please let us know in advance so we can plan accordingly for a swift cleanup.
      
      Thank you all for your ongoing support and dedication to Flower Empower Saturdays. Together, we're making a meaningful 
      impact in our community!
      
      Best regards 🌸`,
      subject: "See you Saturday for Bouquets!🌸",
    });
  }
  if (isPending) return <Loader />;
  return (
    <>
      {event?.closed ? null : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center mt-12">
            <button
              disabled={isPending}
              className="bg-[#e48dde] py-2 px-4 text-white rounded-xl hover:bg-[#d973d2]"
            >
              SEND BOUQUET EMAILS
            </button>
            <input
              type="hidden"
              value="Bouquet Tutorial"
              name="subject"
              {...register("subject")}
            />
            <input
              type="hidden"
              value="Hello thank you for volunteering, here is a link to watch before you come. It's a little tutorial on how to make the bouquet"
              name="body"
              {...register("body")}
            />
          </div>
        </form>
      )}
    </>
  );
}

export default BouquetEmail;
