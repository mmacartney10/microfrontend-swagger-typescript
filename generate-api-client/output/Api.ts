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

export interface Task {
  id?: string;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  /** @format date-time */
  dueDate?: string;
  assignedTo?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface TaskInput {
  title: string;
  description: string;
  /** @default false */
  completed?: boolean;
  priority: "low" | "medium" | "high";
  /** @format date-time */
  dueDate?: string;
  assignedTo?: string;
}

export interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
  imageUrl?: string;
  tags?: string[];
  /** @format date-time */
  createdAt?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  /** @min 0 */
  price: number;
  category: string;
  /** @default true */
  inStock?: boolean;
  imageUrl?: string;
  tags?: string[];
}

export interface OrderItem {
  productId?: string;
  /** @min 1 */
  quantity?: number;
  /** @min 0 */
  price?: number;
}

export interface Order {
  id?: string;
  customerId?: string;
  customerName?: string;
  items?: OrderItem[];
  total?: number;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: string;
  /** @format date-time */
  orderDate?: string;
  /** @format date-time */
  estimatedDelivery?: string;
}

export interface OrderInput {
  customerId: string;
  customerName: string;
  items: OrderItem[];
  /** @min 0 */
  total: number;
  shippingAddress: string;
  /** @format date-time */
  estimatedDelivery?: string;
}

export interface OrderStatusUpdate {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface UserPreferences {
  theme?: "light" | "dark";
  notifications?: boolean;
  language?: string;
}

export interface User {
  id?: string;
  username?: string;
  /** @format email */
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: "admin" | "user" | "moderator";
  active?: boolean;
  /** @format date-time */
  lastLogin?: string;
  /** @format date-time */
  createdAt?: string;
  preferences?: UserPreferences;
}

export interface UserInput {
  username: string;
  /** @format email */
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "moderator";
  /** @default true */
  active?: boolean;
  preferences?: UserPreferences;
}

export interface Category {
  id?: string;
  name?: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  productCount?: number;
  active?: boolean;
  sortOrder?: number;
  /** @format date-time */
  createdAt?: string;
}

export interface CategoryInput {
  name: string;
  description: string;
  parentId?: string;
  icon?: string;
  color: string;
  /** @default true */
  active?: boolean;
  sortOrder?: number;
}

export interface HealthListData {
  /** @example "ok" */
  status?: string;
  /** @format date-time */
  timestamp?: string;
}

export type TasksListData = Task[];

export type TasksCreateData = Task;

export interface TasksUpdateParams {
  id: string;
}

export type TasksUpdateData = Task;

export type ProductsListData = Product[];

export type ProductsCreateData = Product;

export interface ProductsDetailParams {
  id: string;
}

export type ProductsDetailData = Product;

export type OrdersListData = Order[];

export type OrdersCreateData = Order;

export interface OrdersDetailParams {
  id: string;
}

export type OrdersDetailData = Order;

export interface OrdersPartialUpdateParams {
  id: string;
}

export type OrdersPartialUpdateData = Order;

export type UsersListData = User[];

export type UsersCreateData = User;

export interface UsersUpdateParams {
  id: string;
}

export type UsersUpdateData = User;

export type CategoriesListData = Category[];

export type CategoriesCreateData = Category;

export interface CategoriesDeleteParams {
  id: string;
}

export type CategoriesDeleteData = Category;

export namespace System {
  /**
   * No description
   * @tags System
   * @name HealthList
   * @summary Health check endpoint
   * @request GET:/health
   */
  export namespace HealthList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthListData;
  }
}

export namespace TasksService {
  /**
   * No description
   * @tags TasksService
   * @name TasksList
   * @summary Get list of tasks
   * @request GET:/api/tasks
   */
  export namespace TasksList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TasksListData;
  }

  /**
   * No description
   * @tags TasksService
   * @name TasksCreate
   * @summary Create a new task
   * @request POST:/api/tasks
   */
  export namespace TasksCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TaskInput;
    export type RequestHeaders = {};
    export type ResponseBody = TasksCreateData;
  }

  /**
   * No description
   * @tags TasksService
   * @name TasksUpdate
   * @summary Update an existing task
   * @request PUT:/api/tasks/{id}
   */
  export namespace TasksUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = TaskInput;
    export type RequestHeaders = {};
    export type ResponseBody = TasksUpdateData;
  }
}

export namespace ProductsService {
  /**
   * No description
   * @tags ProductsService
   * @name ProductsList
   * @summary Get list of products
   * @request GET:/api/products
   */
  export namespace ProductsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProductsListData;
  }

  /**
   * No description
   * @tags ProductsService
   * @name ProductsCreate
   * @summary Create a new product
   * @request POST:/api/products
   */
  export namespace ProductsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductInput;
    export type RequestHeaders = {};
    export type ResponseBody = ProductsCreateData;
  }

  /**
   * No description
   * @tags ProductsService
   * @name ProductsDetail
   * @summary Get a specific product by ID
   * @request GET:/api/products/{id}
   */
  export namespace ProductsDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProductsDetailData;
  }
}

export namespace OrdersService {
  /**
   * No description
   * @tags OrdersService
   * @name OrdersList
   * @summary Get list of orders
   * @request GET:/api/orders
   */
  export namespace OrdersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = OrdersListData;
  }

  /**
   * No description
   * @tags OrdersService
   * @name OrdersCreate
   * @summary Create a new order
   * @request POST:/api/orders
   */
  export namespace OrdersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = OrderInput;
    export type RequestHeaders = {};
    export type ResponseBody = OrdersCreateData;
  }

  /**
   * No description
   * @tags OrdersService
   * @name OrdersDetail
   * @summary Get order details by ID
   * @request GET:/api/orders/{id}
   */
  export namespace OrdersDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = OrdersDetailData;
  }

  /**
   * No description
   * @tags OrdersService
   * @name OrdersPartialUpdate
   * @summary Update order status
   * @request PATCH:/api/orders/{id}
   */
  export namespace OrdersPartialUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = OrderStatusUpdate;
    export type RequestHeaders = {};
    export type ResponseBody = OrdersPartialUpdateData;
  }
}

export namespace UsersService {
  /**
   * No description
   * @tags UsersService
   * @name UsersList
   * @summary Get list of users
   * @request GET:/api/users
   */
  export namespace UsersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersListData;
  }

  /**
   * No description
   * @tags UsersService
   * @name UsersCreate
   * @summary Create a new user
   * @request POST:/api/users
   */
  export namespace UsersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserInput;
    export type RequestHeaders = {};
    export type ResponseBody = UsersCreateData;
  }

  /**
   * No description
   * @tags UsersService
   * @name UsersUpdate
   * @summary Update an existing user
   * @request PUT:/api/users/{id}
   */
  export namespace UsersUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UserInput;
    export type RequestHeaders = {};
    export type ResponseBody = UsersUpdateData;
  }
}

export namespace CategoriesService {
  /**
   * No description
   * @tags CategoriesService
   * @name CategoriesList
   * @summary Get list of categories
   * @request GET:/api/categories
   */
  export namespace CategoriesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CategoriesListData;
  }

  /**
   * No description
   * @tags CategoriesService
   * @name CategoriesCreate
   * @summary Create a new category
   * @request POST:/api/categories
   */
  export namespace CategoriesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CategoryInput;
    export type RequestHeaders = {};
    export type ResponseBody = CategoriesCreateData;
  }

  /**
   * No description
   * @tags CategoriesService
   * @name CategoriesDelete
   * @summary Delete a category
   * @request DELETE:/api/categories/{id}
   */
  export namespace CategoriesDelete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CategoriesDeleteData;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<
  D extends unknown,
  E extends unknown = unknown,
> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:4000";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Categories API
 * @version 1.0.0
 * @baseUrl http://localhost:4000
 *
 * API for managing categories and classification
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  system = {
    /**
     * No description
     *
     * @tags System
     * @name HealthList
     * @summary Health check endpoint
     * @request GET:/health
     */
    healthList: (params: RequestParams = {}) =>
      this.request<HealthListData, any>({
        path: `/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  tasksService = {
    /**
     * No description
     *
     * @tags TasksService
     * @name TasksList
     * @summary Get list of tasks
     * @request GET:/api/tasks
     */
    tasksList: (params: RequestParams = {}) =>
      this.request<TasksListData, any>({
        path: `/api/tasks`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TasksService
     * @name TasksCreate
     * @summary Create a new task
     * @request POST:/api/tasks
     */
    tasksCreate: (data: TaskInput, params: RequestParams = {}) =>
      this.request<TasksCreateData, void>({
        path: `/api/tasks`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TasksService
     * @name TasksUpdate
     * @summary Update an existing task
     * @request PUT:/api/tasks/{id}
     */
    tasksUpdate: (
      { id, ...query }: TasksUpdateParams,
      data: TaskInput,
      params: RequestParams = {},
    ) =>
      this.request<TasksUpdateData, void>({
        path: `/api/tasks/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  productsService = {
    /**
     * No description
     *
     * @tags ProductsService
     * @name ProductsList
     * @summary Get list of products
     * @request GET:/api/products
     */
    productsList: (params: RequestParams = {}) =>
      this.request<ProductsListData, any>({
        path: `/api/products`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProductsService
     * @name ProductsCreate
     * @summary Create a new product
     * @request POST:/api/products
     */
    productsCreate: (data: ProductInput, params: RequestParams = {}) =>
      this.request<ProductsCreateData, void>({
        path: `/api/products`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProductsService
     * @name ProductsDetail
     * @summary Get a specific product by ID
     * @request GET:/api/products/{id}
     */
    productsDetail: (
      { id, ...query }: ProductsDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<ProductsDetailData, void>({
        path: `/api/products/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  ordersService = {
    /**
     * No description
     *
     * @tags OrdersService
     * @name OrdersList
     * @summary Get list of orders
     * @request GET:/api/orders
     */
    ordersList: (params: RequestParams = {}) =>
      this.request<OrdersListData, any>({
        path: `/api/orders`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrdersService
     * @name OrdersCreate
     * @summary Create a new order
     * @request POST:/api/orders
     */
    ordersCreate: (data: OrderInput, params: RequestParams = {}) =>
      this.request<OrdersCreateData, void>({
        path: `/api/orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrdersService
     * @name OrdersDetail
     * @summary Get order details by ID
     * @request GET:/api/orders/{id}
     */
    ordersDetail: (
      { id, ...query }: OrdersDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<OrdersDetailData, void>({
        path: `/api/orders/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrdersService
     * @name OrdersPartialUpdate
     * @summary Update order status
     * @request PATCH:/api/orders/{id}
     */
    ordersPartialUpdate: (
      { id, ...query }: OrdersPartialUpdateParams,
      data: OrderStatusUpdate,
      params: RequestParams = {},
    ) =>
      this.request<OrdersPartialUpdateData, void>({
        path: `/api/orders/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  usersService = {
    /**
     * No description
     *
     * @tags UsersService
     * @name UsersList
     * @summary Get list of users
     * @request GET:/api/users
     */
    usersList: (params: RequestParams = {}) =>
      this.request<UsersListData, any>({
        path: `/api/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersService
     * @name UsersCreate
     * @summary Create a new user
     * @request POST:/api/users
     */
    usersCreate: (data: UserInput, params: RequestParams = {}) =>
      this.request<UsersCreateData, void>({
        path: `/api/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersService
     * @name UsersUpdate
     * @summary Update an existing user
     * @request PUT:/api/users/{id}
     */
    usersUpdate: (
      { id, ...query }: UsersUpdateParams,
      data: UserInput,
      params: RequestParams = {},
    ) =>
      this.request<UsersUpdateData, void>({
        path: `/api/users/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  categoriesService = {
    /**
     * No description
     *
     * @tags CategoriesService
     * @name CategoriesList
     * @summary Get list of categories
     * @request GET:/api/categories
     */
    categoriesList: (params: RequestParams = {}) =>
      this.request<CategoriesListData, any>({
        path: `/api/categories`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CategoriesService
     * @name CategoriesCreate
     * @summary Create a new category
     * @request POST:/api/categories
     */
    categoriesCreate: (data: CategoryInput, params: RequestParams = {}) =>
      this.request<CategoriesCreateData, void>({
        path: `/api/categories`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CategoriesService
     * @name CategoriesDelete
     * @summary Delete a category
     * @request DELETE:/api/categories/{id}
     */
    categoriesDelete: (
      { id, ...query }: CategoriesDeleteParams,
      params: RequestParams = {},
    ) =>
      this.request<CategoriesDeleteData, void>({
        path: `/api/categories/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
}
