import { apiSlice } from "./apiSlice";

import {
  USER_AUTHENTICATION_URL,
  USER_LOGOUT_URL,
  USER_REGISTRATION_URL,
  USER_PROFILE_URL,
  USER_UPDATE_SUBSCRIPTION,
  USER_ADD_AVIS_URL,
  USER_GET_PARKING,
  USER_GET_AVIS_URL,
  USER_GET_SUBRSCRIPTION,
  USER_GET_ALL_SUBRSCRIPTION,
} from "../utils/constants.js";

const USER_AUTH_URL = USER_AUTHENTICATION_URL;

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: USER_AUTH_URL,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: USER_LOGOUT_URL,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USER_REGISTRATION_URL,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: USER_PROFILE_URL,
        method: "PUT",
        body: data,
      }),
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: USER_UPDATE_SUBSCRIPTION,
        method: "PUT",
        body: data,
      }),
    }),
    getSubscription: builder.mutation({
      query: (data) => ({
        url: USER_GET_SUBRSCRIPTION,
        method: "POST",
        body: data,
      }),
    }),
    getAllSubscription: builder.mutation({
      query: () => ({
        url: USER_GET_ALL_SUBRSCRIPTION,
        method: "POST",
      }),
    }),
    getparking: builder.mutation({
      query: () => ({
        url: USER_GET_PARKING,
        method: "POST",
      }),
    }),

    addAvis: builder.mutation({
      query: (data) => ({
        url: USER_ADD_AVIS_URL,
        method: "PUT",
        body: data,
      }),
    }),
    getAvis: builder.mutation({
      query: () => ({
        url: USER_GET_AVIS_URL,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useUpdateSubscriptionMutation,
  useAddAvisMutation,
  useGetparkingMutation,
  useGetAvisMutation,
  useGetSubscriptionMutation,
  useGetAllSubscriptionMutation,
} = usersApiSlice;
