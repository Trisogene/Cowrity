import { documentServices } from "@/lib/axios/services/documentServices/documentServices";
import { setDocuments } from "@/lib/rtk/slices/dashboardSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useDashboardDocuments = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    documentServices.getDocuments().then((data) => {
      dispatch(setDocuments(data));
    });
  }, []);
  return {};
};

export default useDashboardDocuments;
