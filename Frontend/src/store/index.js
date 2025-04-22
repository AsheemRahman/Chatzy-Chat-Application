import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slice/auth-slice";
import { createChatSlice } from "./slice/chat-slice";


export const useAppStore = create(
    persist(
        (set) => ({
            ...createAuthSlice(set),
            ...createChatSlice(set),
        }),
        {
            name: "auth-storage",
        }
    )
);


// export const useAppStore = create()((...a) => ({
//     ...createAuthSlice(...a),
// }))
