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
  if (userName === undefined) {
    userName = "";
  }
  if (userEmail === undefined) {
    userEmail = "";
  }

  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  let { data: user, error: errorUser } = useUserByEmail(userEmail!);
  console.log(user);

  const { mutateAsync: postUserMutateAsync } = usePostUser();

  // if user not found, create new user (post), update user variable
  if (user?.publicId === "none") {
    console.log(user, "my if call");

    let newUserWithPublicId: User;
    const publicId = nanoid();

    newUserWithPublicId = {
      ...emptyUser,
      publicId: publicId,
      name: userName,
      email: userEmail,
    };

    if (userName !== "" && userEmail !== "") {
      let postUser = async function () {
        const userResult = await postUserMutateAsync(newUserWithPublicId);
        console.log(userResult);
        // replace current user with user from db with _id
        // user = userResult;
      };
      postUser();
    }
  }

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  return <div>{userEmail}</div>;
};

export default LookUpUser;
