import { apiSlice } from "./apiSlice";
import {
  ADMIN_AUTHENTICATION_URL,
  ADMIN_LOGOUT_URL,
  ADMIN_REGISTRATION_URL,
  ADMIN_PROFILE_URL,
  ADMIN_USERS_DATA_FETCH_URL,
  ADMIN_BLOCK_USER_URL,
  ADMIN_UNBLOCK_USER_URL,
  ADMIN_UPDATE_USER_URL,
  ADMIN_DELETE_USER_URL,
  ADMIN_USERS_DATA_GET_URL,
  ADMIN_PARKINGS_DATA_GET_URL,
  ADMIN_REVIEW_DATA_URL,
  ADMIN_ADD_PARKING,
  ADMIN_DELETE_PARKING,
  ADMIN_DELETE_Avis_URL,
  ADMIN_ADD_SUBSCRIPTION,
  ADMIN_USERS_BY_PARKING_FETCH_URL,
  ADMIN_GET_ALL_SUBRSCRIPTION,
  ADMIN_DELETE_SUBSCRIPTION,
  ADMIN_UPDATE_PRICE,
} from "../utils/constants.js";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: ADMIN_AUTHENTICATION_URL,
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: ADMIN_LOGOUT_URL,
        method: "POST",
      }),
    }),
    adminRegister: builder.mutation({
      query: (data) => ({
        url: ADMIN_REGISTRATION_URL,
        method: "POST",
        body: data,
      }),
    }),
    updateAdmin: builder.mutation({
      query: (data) => ({
        url: ADMIN_PROFILE_URL,
        method: "PUT",
        body: data,
      }),
    }),
    getUsersData: builder.mutation({
      query: () => ({
        url: ADMIN_USERS_DATA_FETCH_URL,
        method: "POST",
      }),
    }),
    blockUser: builder.mutation({
      query: (data) => ({
        url: ADMIN_BLOCK_USER_URL,
        method: "PATCH",
        body: data,
      }),
    }),
    unblockUser: builder.mutation({
      query: (data) => ({
        url: ADMIN_UNBLOCK_USER_URL,
        method: "PATCH",
        body: data,
      }),
    }),
    updateUserByAdmin: builder.mutation({
      query: (data) => ({
        url: ADMIN_UPDATE_USER_URL,
        method: "PUT",
        body: data,
      }),
    }),

    getUsersAllData: builder.mutation({
      query: () => ({
        url: ADMIN_USERS_DATA_GET_URL,
        method: "POST",
      }),
    }),

    DeleteUser: builder.mutation({
      query: (data) => ({
        url: ADMIN_DELETE_USER_URL,
        method: "DELETE",
        body: data,
      }),
    }),

    getParkingsAllData: builder.mutation({
      query: () => ({
        url: ADMIN_PARKINGS_DATA_GET_URL,
        method: "POST",
      }),
    }),

    addParking: builder.mutation({
      query: (data) => ({
        url: ADMIN_ADD_PARKING,
        method: "POST",
        body: data,
      }),
    }),

    getReviewsData: builder.mutation({  
      query: () => ({
          url: ADMIN_REVIEW_DATA_URL,
          method: 'POST',
      })

  }),
    DeleteParking: builder.mutation({
      query: (data) => ({
        url: ADMIN_DELETE_PARKING,
        method: "DELETE",
        body: data,
      }),
    }),
    
    DeleteAvis: builder.mutation({
      query: (data) => ({
        url: ADMIN_DELETE_Avis_URL,
      }),
    }),

    AddSub: builder.mutation({
      query: (data) => ({
        url: ADMIN_ADD_SUBSCRIPTION,
        method: "POST",
        body: data,
      }),
    }),
    getAllAdminSubscription: builder.mutation({
      query: () => ({
        url: ADMIN_GET_ALL_SUBRSCRIPTION,
        method: "POST",
      }),
    }),
    getUsersByParkingId: builder.mutation({
      query: (parkingId) => ({
        url: `/get-users-by-parking?parkingId=${parkingId}`,  // parkingId dans l'URL
        method: 'POST',
      }),
    }),
    deleteSubscription: builder.mutation({
      query: (data) => ({
        url: ADMIN_DELETE_SUBSCRIPTION,
        method: "DELETE",
        body: data,
      }),
    }),
    updateSubPrice: builder.mutation({
      query: (data) => ({
        url: ADMIN_UPDATE_PRICE,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRegisterMutation,
  useUpdateAdminMutation,
  useGetUsersDataMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserByAdminMutation,
  useDeleteUserMutation,
  useGetUsersAllDataMutation,
  useGetParkingsAllDataMutation,
  useAddParkingMutation,
  useGetReviewsDataMutation,
  useDeleteParkingMutation,
  useDeleteAvisMutation,
  useAddSubMutation,
  useGetAllAdminSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubPriceMutation,
  useGetUsersByParkingIdMutation,
} = adminApiSlice;
