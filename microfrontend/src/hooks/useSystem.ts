import { useQuery } from "@tanstack/react-query";
import { healthListOptions } from "../@swagger-ts";
import { system } from "../services/api";

export const useHealthList = () => {
  return useQuery(healthListOptions(system));
};
