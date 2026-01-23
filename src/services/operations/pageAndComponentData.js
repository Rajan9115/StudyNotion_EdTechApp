import React from 'react'
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
        const response = await apiConnector(
          "GET",
            catalogData.CATALOGPAGEDATA_API,
            null,  // no body for GET
            null,  // no headers
            { categoryId } // query params
      );

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error("No courses found in this category");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

