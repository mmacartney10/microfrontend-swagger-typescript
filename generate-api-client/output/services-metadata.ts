/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Params {
  param: string;
  type: string;
}

export interface RouteConfig {
  queryKey: string;
  method: string;
  httpMethod: string;
  params: Params[];
}

export interface ServiceConfig {
  name: string;
  serviceName: string;
  routes: RouteConfig[];
}

export const SERVICES_METADATA: ServiceConfig[] = [
  {
    name: "System",
    serviceName: "system",
    routes: [
      {
        method: "healthList",
        httpMethod: "get",
        pathParams: [],
        requestBodyType: null,
        requestParamsType: null,
      },
    ],
  },
  {
    name: "Tasks",
    serviceName: "tasksService",
    routes: [
      {
        method: "tasksList",
        httpMethod: "get",
        pathParams: [],
        requestBodyType: null,
        requestParamsType: null,
      },
      {
        method: "tasksCreate",
        httpMethod: "post",
        pathParams: [],
        requestBodyType: "TaskInput",
        requestParamsType: null,
      },
      {
        method: "tasksUpdate",
        httpMethod: "put",
        pathParams: [
          {
            name: "id",
            type: "string",
            optional: false,
          },
        ],
        requestBodyType: "TaskInput",
        requestParamsType: "TasksUpdateParams",
      },
    ],
  },
  {
    name: "Products",
    serviceName: "productsService",
    routes: [
      {
        method: "productsList",
        httpMethod: "get",
        pathParams: [],
        requestBodyType: null,
        requestParamsType: null,
      },
      {
        method: "productsCreate",
        httpMethod: "post",
        pathParams: [],
        requestBodyType: "ProductInput",
        requestParamsType: null,
      },
      {
        method: "productsDetail",
        httpMethod: "get",
        pathParams: [
          {
            name: "id",
            type: "string",
            optional: false,
          },
        ],
        requestBodyType: null,
        requestParamsType: "ProductsDetailParams",
      },
    ],
  },
  {
    name: "Orders",
    serviceName: "ordersService",
    routes: [
      {
        method: "ordersList",
        httpMethod: "get",
        pathParams: [],
        requestBodyType: null,
        requestParamsType: null,
      },
      {
        method: "ordersCreate",
        httpMethod: "post",
        pathParams: [],
        requestBodyType: "OrderInput",
        requestParamsType: null,
      },
      {
        method: "ordersDetail",
        httpMethod: "get",
        pathParams: [
          {
            name: "id",
            type: "string",
            optional: false,
          },
        ],
        requestBodyType: null,
        requestParamsType: "OrdersDetailParams",
      },
      {
        method: "ordersPartialUpdate",
        httpMethod: "patch",
        pathParams: [
          {
            name: "id",
            type: "string",
            optional: false,
          },
        ],
        requestBodyType: "OrderStatusUpdate",
        requestParamsType: "OrdersPartialUpdateParams",
      },
    ],
  },
  {
    name: "Users",
    serviceName: "usersService",
    routes: [
      {
        method: "usersList",
        httpMethod: "get",
        pathParams: [],
        requestBodyType: null,
        requestParamsType: null,
      },
      {
        method: "usersCreate",
        httpMethod: "post",
        pathParams: [],
        requestBodyType: "UserInput",
        requestParamsType: null,
      },
      {
        method: "usersUpdate",
        httpMethod: "put",
        pathParams: [
          {
            name: "id",
            type: "string",
            optional: false,
          },
        ],
        requestBodyType: "UserInput",
        requestParamsType: "UsersUpdateParams",
      },
    ],
  },
  {
    name: "Categories",
    serviceName: "categoriesService",
    routes: [
      {
        method: "categoriesList",
        httpMethod: "get",
        pathParams: [],
        requestBodyType: null,
        requestParamsType: null,
      },
      {
        method: "categoriesCreate",
        httpMethod: "post",
        pathParams: [],
        requestBodyType: "CategoryInput",
        requestParamsType: null,
      },
      {
        method: "categoriesDelete",
        httpMethod: "delete",
        pathParams: [
          {
            name: "id",
            type: "string",
            optional: false,
          },
        ],
        requestBodyType: null,
        requestParamsType: "CategoriesDeleteParams",
      },
    ],
  },
];
