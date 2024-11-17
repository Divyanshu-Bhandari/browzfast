import { currentUser, auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const initialUser = async () => {
    const user = await currentUser();
    if(!user) {
        return auth().redirectToSignIn;
    }

    const existingUser = await db.user.findUnique({
        where: {
            id: user.id
        }
    });

    if(existingUser) {
        return existingUser;
    }

    const newUser = await db.user.create({
        data: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
        }
    });

    return newUser;
}