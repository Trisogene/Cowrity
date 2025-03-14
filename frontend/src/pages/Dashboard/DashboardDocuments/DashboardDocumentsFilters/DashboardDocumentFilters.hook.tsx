import { setDashboardSearch } from "@/lib/rtk/slices/dashboardSlice";
import { useRtk } from "@/lib/rtk/store";
import { useDispatch } from "react-redux";

const useDashboardDocumentFilters = () => {
  const dispatch = useDispatch();

  const search = useRtk((state) => state.dashboard.search);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDashboardSearch(e.target.value));
  };

  return { onChangeSearch, search };
};

export default useDashboardDocumentFilters;
