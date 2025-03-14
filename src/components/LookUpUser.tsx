import { nanoid } from "nanoid";
import { emptyUser } from "../constants/constants";
import usePostUser from "../hooks/usePostUser";
import useUserByEmail from "../hooks/useUserByEmail";
import { User } from "../interfaces/interfaces";

interface Props {
  userName: string | undefined;
  userEmail: string | undefined;
}

const LookUpUser = ({ userName, userEmail }: Props) => {
  let newUserWithPublicId: User;

  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  let { data: user, error: errorUser } = useUserByEmail(userEmail!);
  console.log(user);

  const { mutateAsync: postUserMutateAsync } = usePostUser();

  const postUser = async function () {
    const userResult = await postUserMutateAsync(newUserWithPublicId);
    console.log(userResult);
    // replace current user with user from db with _id
    user = userResult;
  };

  if (userName === undefined) {
    userName = "";
  }
  if (userEmail === undefined) {
    userEmail = "";
  }

  // if user not found, create new user (post), update user variable
  if (user?.publicId === "none") {
    console.log(user, "my if call");

    const publicId = nanoid();

    newUserWithPublicId = {
      ...emptyUser,
      publicId: publicId,
      name: userName,
      email: userEmail,
    };

    if (userName !== "" && userEmail !== "") {
      postUser();
    }
  } else {
    newUserWithPublicId = { ...emptyUser, publicId: "0" };
  }

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  return <div>{userEmail}</div>;
};

export default LookUpUser;
