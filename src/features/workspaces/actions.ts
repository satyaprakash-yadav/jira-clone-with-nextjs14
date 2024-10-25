import { cookies } from "next/headers"
import { Databases, Client, Query, Account } from "node-appwrite"

import { AUTH_COOKIE } from "@/features/auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE);

        if (!session) return { documents: [], total: 0 };

        client.setSession(session.value);
        const databases = new Databases(client);
        const account = new Account(client);
        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if (members.total === 0) {
            return { documents: [], total: 0 };
        };

        const workspaceIds = members.documents.map((member) => member.workspaceId);

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACE_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds)
            ]
        );

        return workspaces;
    } catch (error) {
        return { documents: [], total: 0, error };
    }
};

interface GetWorkspaceProps {
    workspaceId: string;
};

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE);

        if (!session) return null;

        client.setSession(session.value);
        const databases = new Databases(client);
        const account = new Account(client);
        const user = await account.get();

        const member = await getMember({
            databases,
            userId: user.$id,
            workspaceId,
        })

        if (!member) {
            return null;
        };

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        );

        return workspace;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
};