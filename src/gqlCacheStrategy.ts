import { MD5 } from "crypto-js";
import { get, set, createStore } from "idb-keyval";

const store = createStore("GraphQL-Cache", "CacheableResponses");

const serializeResponse = async (response: Response) => {
  let serializedHeaders = {};
  for (var entry of response.headers.entries()) {
    serializedHeaders[entry[0]] = entry[1];
  }
  let serialized = {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText,
    body: await response.json()
  };
  return serialized;
};

// Get cached response from IndexedDB
const getCache = async (request: Request) => {
  try {
    const body = await request.json();
    // Get unique id with the combintion of operation name & variables
    const { operationName, variables } = body;
    const operationWithVariableString =
      operationName + JSON.stringify(variables);
    const id = MD5(operationWithVariableString).toString();
    // Get data from IndexedDB
    const data = await get(id, store);
    // This request is not cached
    if (!data) {
      const init = {
        status: 204,
        statusText: "No content"
      };
      return new Response(null, init);
    }
    // Check cache max age.
    let cacheControl = request.headers.get("Cache-Control");
    let maxAge = cacheControl ? parseInt(cacheControl.split("=")[1]) : 3600;
    // Cache expired
    if (Date.now() - data.timestamp > maxAge * 1000) {
      console.log("Cache expired. Load from API endpoint.");
      const init = {
        status: 404,
        statusText: "Cache expired"
      };
      return new Response(null, init);
    }
    // Successfully loaded data from indexdDB
    console.log("Loaded cached response");
    return new Response(JSON.stringify(data.response.body), data.response);
  } catch (err) {
    // Send 500 response for any error
    console.log(err);
    const init = {
      status: 500,
      statusText: "Internal server error"
    };
    return new Response(new Blob(), init);
  }
};

const setCache = async (request: Request, response: Response) => {
  const { operationName, variables, query } = await request.json();
  // Only cache "get" requests, i.e.: no mutation requests or user login etc.
  const cacheableOperations = ["getAllPosts", "getUserPosts", "getCurrentPost"];
  const isCacheable = cacheableOperations.includes(operationName);
  if (!isCacheable) {
    return;
  }
  // Combine operation name & variables to make unique ids for IndexedDB
  const operationWithVariableString = operationName + JSON.stringify(variables);
  const id = MD5(operationWithVariableString).toString();
  // Save serialized request in IndexedDB
  const entry = {
    query: query,
    response: await serializeResponse(response),
    timestamp: Date.now()
  };
  set(id, entry, store);
  console.log("cached " + operationName);
};

const networkFirst = async (request: Request) => {
  try {
    // Get network response
    const networkResponse = await fetch(request.clone());
    // Cache newly fetched response
    setCache(request.clone(), networkResponse.clone());
    return networkResponse;
  } catch (err) {
    // Network fetch failed, load chached response instead
    console.log({ err });
    // Get cached response
    const cachedResponse = await getCache(request.clone());
    // Network response is prioritised
    return Promise.resolve(cachedResponse);
  }
};

export default networkFirst;
