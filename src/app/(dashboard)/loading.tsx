import { Loader } from "lucide-react";

const DashboadLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default DashboadLoading;
