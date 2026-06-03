import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import type { ComponentType, SVGProps } from "react";

type Props = {
  linkUrl: string;
  functionName: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const CustomButton = ({ linkUrl, functionName, icon: Icon }: Props) => {
  return (
    <Link to={linkUrl}>
      <Button className="px-12 py-6 rounded-xl text-base">
        <div className="flex justify-center items-center ">
          <Icon
            className="mr-2 bg-white rounded-full text-rambutant-100"
            fill="none"
          />
          {functionName}
        </div>
      </Button>
    </Link>
  );
};

export default CustomButton;
