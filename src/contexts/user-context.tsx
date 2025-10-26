/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, ReactNode } from "react";


interface UserContextType {
    user: any | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
    children,
    initialUser
}: {
    children: ReactNode;
    initialUser: any | null;
}) {
    return (
        <UserContext.Provider value={{ user: initialUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}