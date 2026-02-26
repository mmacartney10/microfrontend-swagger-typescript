import { Api } from "@swagger-ts/api-client";

export const apiClient = new Api({
  baseUrl: "http://localhost:4000",
  baseApiParams: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

export const {
  tasksService,
  productsService,
  ordersService,
  usersService,
  categoriesService,
} = apiClient;
