export default function({ $axios, redirect, store }) {
  $axios.onRequest(
    config => {
      config.withCredentials = true;
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );
}
