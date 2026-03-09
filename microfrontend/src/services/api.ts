import { Api } from "@swagger-ts/api-client-two";

export const apiClient = new Api({
  baseUrl: "http://localhost:4000",
  baseApiParams: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

export const {
  system,
  tasksService,
  productsService,
  ordersService,
  usersService,
  categoriesService,
} = apiClient;
