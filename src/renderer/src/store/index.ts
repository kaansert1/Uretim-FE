import { configureStore } from "@reduxjs/toolkit";
import loader from "@/store/features/loader";
import employee from "@/store/features/employee";
import production from "@/store/features/production";
import assembly from "@/store/features/assembly";
import labelVerification from "@/store/features/label-verification";
import helpRequest from "@/store/features/helpRequest";

const store = configureStore({
  reducer: {
    loader,
    employee,
    production,
    assembly,
    labelVerification,
    helpRequest,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
