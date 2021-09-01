import axios from "axios";

export interface ResponseConfig {
  code: number;
  msg: string;
  data: any;
}

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "http://localhost:12301";

axios.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      "content-type": "application/json",
    };
    return config;
  },
  (error) => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response && response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  },
  (error) => {
    console.log(error);
  }
);

export const get = async (
  url: string,
  params = {}
): Promise<ResponseConfig | any> => {
  return axios.get(url, {
    params: params,
  });
};

export const post = async (
  url: string,
  data = {}
): Promise<ResponseConfig | any> => {
  return axios.post(url, data);
};

export const put = async (
  url: string,
  data = {}
): Promise<ResponseConfig | any> => {
  return axios.put(url, data);
};

export const del = async (
  url: string,
  data = {}
): Promise<ResponseConfig | any> => {
  return axios.delete(url, data);
};
