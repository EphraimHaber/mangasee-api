import { CapacitorHttp } from '@capacitor/core';
import axios from 'axios';

export const httpGetHandler = {
  axios: axios.get,
  capacitor: CapacitorHttp.get,
} as const;

type HttpGetKey = keyof typeof httpGetHandler;

export const doGet = async (mode: HttpGetKey, url: string, shouldParse?: boolean) => {
  if (mode === 'axios') {
    const response = await httpGetHandler[mode](url);
    return response.data;
  }
  if (mode === 'capacitor') {
    const response = await CapacitorHttp.get({ url: url });
    if (shouldParse) {
      return JSON.parse(response.data);
    }
    return response.data;
  }
};
