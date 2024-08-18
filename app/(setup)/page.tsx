import { initialUser } from "@/lib/initial-user";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const user = await initialUser();

  if (user) {
    redirect("/home");
  } else {
    redirect("/sign-in");
  }
};

export default SetupPage;
