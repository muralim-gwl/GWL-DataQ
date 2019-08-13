import axios from "axios";
import { addQueryArg } from "./commons";
import { prepareFinalObject } from "../ui-redux/screen-configuration/actions";
import store from "../ui-redux/store";

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  return userInfo.session_id;
};

let axiosInstances = {
  instanceOne: axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "application/json"
    }
  }),
  instanceTwo: axios.create({
    baseURL: "",
    // window.location.origin,
    headers: {
      "Content-Type": "application/json"
    }
  })
};

const wrapRequestBody = requestBody => {
  return requestBody;
};

export const httpRequest = async ({
  method = "post",
  endPoint,
  queryObject = [],
  requestBody = {},
  instance = "instanceOne",
  hasSpinner = true,
  contentType = "application/x-www-form-urlencoded"
}) => {
  if (hasSpinner) {
    store.dispatch(prepareFinalObject("spinner", true));
  }
  let apiError = "Api Error";

  var headerConfig = {
    headers: {}
  };
  if (contentType) {
    switch (contentType) {
      case "application/x-www-form-urlencoded":
        var params = new URLSearchParams();
        for (var variable in requestBody) {
          if (requestBody.hasOwnProperty(variable)) {
            params.append(variable, requestBody[variable]);
          }
        }
        requestBody=params;
        break;
      default:

    }
    const session_id=getToken();
    if (session_id) {
      params.append("session.id", session_id);
      params.append("session_id", session_id);
    }
    headerConfig.headers["Content-Type"] = contentType;
  }

  endPoint = addQueryArg(endPoint, queryObject);
  var response;
  try {
    switch (method) {
      case "post":
        response = await axiosInstances[instance].post(
          endPoint,
          wrapRequestBody(requestBody),
          headerConfig
        );
        break;
      default:
        response = await axiosInstances[instance].get(endPoint, headerConfig);
    }
    const responseStatus = parseInt(response.status, 10);
    if (hasSpinner) {
      store.dispatch(prepareFinalObject("spinner", false));
    }
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError = data;
    }
    if (hasSpinner) {
      store.dispatch(prepareFinalObject("spinner", false));
    }
  }

  return apiError;
};
