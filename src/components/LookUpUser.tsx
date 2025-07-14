import { nanoid } from "nanoid";
import { emptyUser } from "../constants/constants.js";
import usePostUser from "../hooks/usePostUser.js";
import useUserByEmail from "../hooks/useUserByEmail.js";
import { User } from "../interfaces/interfaces.js";

interface Props {
  userName: string | undefined;
  userEmail: string | undefined;
}

const LookUpUser = ({ userName, userEmail }: Props) => {
  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  let { data: user, error: errorUser } = useUserByEmail(userEmail!);
  console.log(user);

  const { mutateAsync: postUserMutateAsync } = usePostUser();

  const postUser = async (newUser: User) => {
    const userResult = await postUserMutateAsync(newUser);
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

  // if user not found, create new user (post), update current user with db result user
  if (user?.publicId === "none") {
    console.log(user, "my if call");

    const publicId = nanoid();

    let newUserWithPublicId = {
      ...emptyUser,
      publicId: publicId,
      name: userName,
      email: userEmail,
    };

    if (userName !== "" && userEmail !== "") {
      postUser(newUserWithPublicId);
    }
  }

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  return <p>{userEmail ? userEmail : "no user email"}</p>;
};

export default LookUpUser;
