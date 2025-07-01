import { getCurrentUserOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

const SamplePage = () => {
  const { data, isPending } = useQuery({
    ...getCurrentUserOptions(),
  });
  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sample Page</h1>
      <p>Welcome,{data?.data?.fullName}!</p>
      <p>Your email: {data?.data?.email || "Not provided"}</p>
    </div>
  );
};

export default SamplePage;
