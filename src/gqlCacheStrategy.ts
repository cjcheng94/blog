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
      return null;
    }
    // Check cache max age.
    let cacheControl = request.headers.get("Cache-Control");
    let maxAge = cacheControl ? parseInt(cacheControl.split("=")[1]) : 3600;
    // Cache expired
    if (Date.now() - data.timestamp > maxAge * 1000) {
      console.log("Cache expired. Load from API endpoint.");
      return null;
    }
    // Successfully loaded data from indexdDB
    console.log("Loaded cached response");
    return new Response(JSON.stringify(data.response.body), data.response);
  } catch (err) {
    console.log("couldn't find in cache");
    return null;
  }
};

const setCache = async (request: Request, response: Response) => {
  const { operationName, variables, query } = await request.json();
  // Only cache "get" requests, i.e.: no mutation requests or user login etc.
  const cacheableOperations = [
    "getAllPosts",
    "getUserPosts",
    "getCurrentPost",
    "getPostsByTags",
    "search",
    "getAllTags",
    "getTagsById"
  ];
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

// If there's a cached version available, use it, but fetch an update for next time.
const staleWhileRevalidate = async (request: Request) => {
  // Try to get response from cache
  const cachedResponse = await getCache(request.clone());

  // Get network response
  const networkResponse = fetch(request.clone())
    .then(response => {
      // Cache newly fetched response
      setCache(request.clone(), response.clone());
      return response;
    })
    .catch(err => {
      console.log(err);
    });

  // If the response is cached, return cached response,
  // otherwise return network response
  return cachedResponse
    ? Promise.resolve(cachedResponse)
    : (networkResponse as Promise<Response>);
};

export default staleWhileRevalidate;
