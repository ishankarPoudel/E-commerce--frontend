import { BagEntity } from "@/api";

type UpdateBagProps = {
  bag: BagEntity;
};

const UpdateBag = ({ bag }: UpdateBagProps) => {
  console.log("UpdateBagID is as follow", bag);
  return <div>Here will be the ui to update the bag</div>;
};

export default UpdateBag;
