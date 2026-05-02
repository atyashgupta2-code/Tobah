var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { B as ProtocolError, T as TimeoutWaitingForResponseErrorCode, C as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, G as Certificate, H as lookupResultToBuffer, I as RequestStatusResponseStatus, U as UnknownError, J as RequestStatusDoneNoReplyErrorCode, K as RejectError, N as CertifiedRejectErrorCode, Q as UNREACHABLE_ERROR, V as InputError, W as InvalidReadStateRequestErrorCode, Y as ReadRequestType, Z as Principal, _ as IDL, $ as MissingCanisterIdErrorCode, a0 as HttpAgent, a1 as encode, a2 as QueryResponseStatus, a3 as UncertifiedRejectErrorCode, a4 as isV3ResponseBody, a5 as isV2ResponseBody, a6 as UncertifiedRejectUpdateErrorCode, a7 as UnexpectedErrorCode, a8 as decode, t as Subscribable, a9 as pendingThenable, aa as resolveEnabled, v as shallowEqualObjects, ab as resolveStaleTime, z as noop, ac as environmentManager, ad as isValidTimeout, ae as timeUntilStale, af as timeoutManager, ag as focusManager, ah as fetchState, ai as replaceData, y as notifyManager, r as reactExports, A as shouldThrowError, q as useQueryClient, o as useInternetIdentity, aj as createActorWithConfig, ak as Variant, al as Record, am as Opt, an as Vec, ao as Service, ap as Func, aq as Text, ar as Bool, as as Tuple, at as Nat, au as Null, av as Int } from "./index-D052jQ_k.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const OrderId = Text;
const FulfillmentBy = Variant({
  "AdminFulfilled": Null,
  "SellerFulfilled": Null
});
const OrderStatus$1 = Variant({
  "Delivered": Null,
  "Confirmed": Null,
  "Placed": Null,
  "Rejected": Null,
  "Accepted": Null,
  "Cancelled": Null,
  "Processing": Null,
  "Shipped": Null,
  "Pending": Null
});
const PaymentMethod = Variant({
  "Card": Null,
  "CashOnDelivery": Null
});
const Timestamp = Int;
const DeliveryOption = Variant({
  "SameDay": Null,
  "NextDay": Null,
  "Standard": Null
});
const CustomerId = Text;
const ProductId = Text;
const CartItem = Record({
  "productId": ProductId,
  "deliveryOption": DeliveryOption,
  "quantity": Nat,
  "selectedSize": Text
});
const Order = Record({
  "id": OrderId,
  "customerName": Text,
  "status": OrderStatus$1,
  "couponCode": Opt(Text),
  "total": Nat,
  "paymentMethod": PaymentMethod,
  "customerPhone": Text,
  "discountAmount": Opt(Nat),
  "createdAt": Timestamp,
  "deliveryOption": DeliveryOption,
  "shippingAddress": Text,
  "customerId": CustomerId,
  "items": Vec(CartItem),
  "fulfillmentChoice": Opt(FulfillmentBy)
});
const ModelPhotoId = Text;
const ModelPhoto = Record({
  "id": ModelPhotoId,
  "createdAt": Timestamp,
  "imageUrl": Text,
  "caption": Opt(Text)
});
const CouponInput = Record({
  "code": Text,
  "description": Text,
  "discountPercent": Nat
});
const CouponId = Text;
const Coupon = Record({
  "id": CouponId,
  "code": Text,
  "createdAt": Timestamp,
  "description": Text,
  "discountPercent": Nat,
  "isActive": Bool
});
const ProductInput = Record({
  "fulfillmentBy": FulfillmentBy,
  "subcategory": Opt(Text),
  "name": Text,
  "description": Text,
  "hasFitAndTry": Bool,
  "sizes": Vec(Text),
  "sellerName": Text,
  "stock": Nat,
  "imageUrl": Text,
  "hasSameDayDelivery": Bool,
  "gender": Text,
  "category": Text,
  "sellerId": Text,
  "price": Nat,
  "isTrending": Bool
});
const Product = Record({
  "id": ProductId,
  "fulfillmentBy": FulfillmentBy,
  "subcategory": Opt(Text),
  "name": Text,
  "createdAt": Int,
  "isNewArrival": Bool,
  "description": Text,
  "hasFitAndTry": Bool,
  "sizes": Vec(Text),
  "sellerName": Text,
  "orderCount": Nat,
  "stock": Nat,
  "imageUrl": Text,
  "hasSameDayDelivery": Bool,
  "gender": Text,
  "category": Text,
  "sellerId": Text,
  "price": Nat,
  "isTrending": Bool
});
const NotificationId = Text;
const Notification = Record({
  "id": NotificationId,
  "createdAt": Int,
  "isRead": Bool,
  "orderId": Opt(Text),
  "message": Text,
  "sellerId": Opt(Text)
});
const Customer = Record({
  "id": CustomerId,
  "name": Text,
  "createdAt": Timestamp,
  "phone": Text
});
const SellerId = Text;
const Seller = Record({
  "id": SellerId,
  "isApproved": Bool,
  "name": Text,
  "createdAt": Int,
  "businessName": Text,
  "email": Text,
  "address": Text,
  "phone": Text
});
const ProductEarningBreakdown = Record({
  "productId": Text,
  "productName": Text,
  "orderCount": Nat,
  "totalRevenue": Nat
});
const SellerEarnings = Record({
  "productBreakdown": Vec(ProductEarningBreakdown),
  "orderCount": Nat,
  "totalEarnings": Nat
});
const SellerInput = Record({
  "name": Text,
  "businessName": Text,
  "email": Text,
  "address": Text,
  "phone": Text
});
const Measurements = Record({
  "weight": Nat,
  "height": Nat,
  "chest": Nat,
  "waist": Nat
});
const FitAndTryRequest = Record({
  "productId": ProductId,
  "measurements": Measurements,
  "preferredSize": Text
});
Service({
  "acceptOrder": Func(
    [OrderId, FulfillmentBy, Text],
    [Variant({ "ok": Order, "err": Text })],
    []
  ),
  "addModelPhoto": Func(
    [Text, Opt(Text)],
    [Variant({ "ok": ModelPhoto, "err": Text })],
    []
  ),
  "addNotification": Func(
    [Text, Opt(Text), Opt(Text)],
    [Text],
    []
  ),
  "cancelOrder": Func(
    [OrderId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "createCoupon": Func(
    [CouponInput],
    [Variant({ "ok": Coupon, "err": Text })],
    []
  ),
  "createOrder": Func(
    [
      Vec(CartItem),
      Text,
      DeliveryOption,
      PaymentMethod,
      Text,
      Text,
      CustomerId,
      Opt(Text)
    ],
    [Order],
    []
  ),
  "createProduct": Func(
    [ProductInput],
    [Variant({ "ok": Product, "err": Text })],
    []
  ),
  "deleteCoupon": Func(
    [CouponId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteModelPhoto": Func(
    [ModelPhotoId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteProduct": Func(
    [ProductId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "getAllNotifications": Func([], [Vec(Notification)], ["query"]),
  "getCoupon": Func([Text], [Opt(Coupon)], ["query"]),
  "getCouponOrderStats": Func(
    [Text],
    [
      Opt(
        Record({
          "couponCode": Text,
          "totalOrders": Nat,
          "successfulOrders": Nat
        })
      )
    ],
    ["query"]
  ),
  "getCustomer": Func([Text], [Opt(Customer)], ["query"]),
  "getNewArrivals": Func([], [Vec(Product)], ["query"]),
  "getNotifications": Func(
    [Opt(Text)],
    [Vec(Notification)],
    ["query"]
  ),
  "getOrder": Func([OrderId], [Opt(Order)], ["query"]),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "getProducts": Func([], [Vec(Product)], ["query"]),
  "getProductsBySeller": Func([Text], [Vec(Product)], ["query"]),
  "getSeller": Func([SellerId], [Opt(Seller)], ["query"]),
  "getSellerByEmailOrPhone": Func(
    [Text, Text],
    [Opt(Seller)],
    ["query"]
  ),
  "getSellerEarnings": Func([Text], [SellerEarnings], ["query"]),
  "listCoupons": Func([], [Vec(Coupon)], ["query"]),
  "listModelPhotos": Func([], [Vec(ModelPhoto)], ["query"]),
  "listOrders": Func([], [Vec(Tuple(OrderId, Order))], ["query"]),
  "listOrdersByCustomer": Func([Text], [Vec(Order)], ["query"]),
  "listOrdersBySeller": Func([Text], [Vec(Order)], ["query"]),
  "listSellers": Func([], [Vec(Seller)], ["query"]),
  "markNotificationRead": Func([Text], [Bool], []),
  "registerCustomer": Func([Text, Text], [Customer], []),
  "registerSeller": Func(
    [SellerInput],
    [Variant({ "ok": Seller, "err": Text })],
    []
  ),
  "rejectOrder": Func(
    [OrderId, Text],
    [Variant({ "ok": Order, "err": Text })],
    []
  ),
  "removeSeller": Func([SellerId], [Bool], []),
  "setNewArrival": Func(
    [ProductId, Bool],
    [Variant({ "ok": Product, "err": Text })],
    []
  ),
  "setProductTrending": Func(
    [ProductId, Bool],
    [Variant({ "ok": Product, "err": Text })],
    []
  ),
  "submitFitAndTryRequest": Func([FitAndTryRequest], [Text], []),
  "toggleCoupon": Func(
    [CouponId],
    [Variant({ "ok": Coupon, "err": Text })],
    []
  ),
  "updateOrderStatus": Func(
    [OrderId, OrderStatus$1],
    [Variant({ "ok": Order, "err": Text })],
    []
  ),
  "updateProduct": Func(
    [ProductId, ProductInput],
    [Variant({ "ok": Product, "err": Text })],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const OrderId2 = IDL2.Text;
  const FulfillmentBy2 = IDL2.Variant({
    "AdminFulfilled": IDL2.Null,
    "SellerFulfilled": IDL2.Null
  });
  const OrderStatus2 = IDL2.Variant({
    "Delivered": IDL2.Null,
    "Confirmed": IDL2.Null,
    "Placed": IDL2.Null,
    "Rejected": IDL2.Null,
    "Accepted": IDL2.Null,
    "Cancelled": IDL2.Null,
    "Processing": IDL2.Null,
    "Shipped": IDL2.Null,
    "Pending": IDL2.Null
  });
  const PaymentMethod2 = IDL2.Variant({
    "Card": IDL2.Null,
    "CashOnDelivery": IDL2.Null
  });
  const Timestamp2 = IDL2.Int;
  const DeliveryOption2 = IDL2.Variant({
    "SameDay": IDL2.Null,
    "NextDay": IDL2.Null,
    "Standard": IDL2.Null
  });
  const CustomerId2 = IDL2.Text;
  const ProductId2 = IDL2.Text;
  const CartItem2 = IDL2.Record({
    "productId": ProductId2,
    "deliveryOption": DeliveryOption2,
    "quantity": IDL2.Nat,
    "selectedSize": IDL2.Text
  });
  const Order2 = IDL2.Record({
    "id": OrderId2,
    "customerName": IDL2.Text,
    "status": OrderStatus2,
    "couponCode": IDL2.Opt(IDL2.Text),
    "total": IDL2.Nat,
    "paymentMethod": PaymentMethod2,
    "customerPhone": IDL2.Text,
    "discountAmount": IDL2.Opt(IDL2.Nat),
    "createdAt": Timestamp2,
    "deliveryOption": DeliveryOption2,
    "shippingAddress": IDL2.Text,
    "customerId": CustomerId2,
    "items": IDL2.Vec(CartItem2),
    "fulfillmentChoice": IDL2.Opt(FulfillmentBy2)
  });
  const ModelPhotoId2 = IDL2.Text;
  const ModelPhoto2 = IDL2.Record({
    "id": ModelPhotoId2,
    "createdAt": Timestamp2,
    "imageUrl": IDL2.Text,
    "caption": IDL2.Opt(IDL2.Text)
  });
  const CouponInput2 = IDL2.Record({
    "code": IDL2.Text,
    "description": IDL2.Text,
    "discountPercent": IDL2.Nat
  });
  const CouponId2 = IDL2.Text;
  const Coupon2 = IDL2.Record({
    "id": CouponId2,
    "code": IDL2.Text,
    "createdAt": Timestamp2,
    "description": IDL2.Text,
    "discountPercent": IDL2.Nat,
    "isActive": IDL2.Bool
  });
  const ProductInput2 = IDL2.Record({
    "fulfillmentBy": FulfillmentBy2,
    "subcategory": IDL2.Opt(IDL2.Text),
    "name": IDL2.Text,
    "description": IDL2.Text,
    "hasFitAndTry": IDL2.Bool,
    "sizes": IDL2.Vec(IDL2.Text),
    "sellerName": IDL2.Text,
    "stock": IDL2.Nat,
    "imageUrl": IDL2.Text,
    "hasSameDayDelivery": IDL2.Bool,
    "gender": IDL2.Text,
    "category": IDL2.Text,
    "sellerId": IDL2.Text,
    "price": IDL2.Nat,
    "isTrending": IDL2.Bool
  });
  const Product2 = IDL2.Record({
    "id": ProductId2,
    "fulfillmentBy": FulfillmentBy2,
    "subcategory": IDL2.Opt(IDL2.Text),
    "name": IDL2.Text,
    "createdAt": IDL2.Int,
    "isNewArrival": IDL2.Bool,
    "description": IDL2.Text,
    "hasFitAndTry": IDL2.Bool,
    "sizes": IDL2.Vec(IDL2.Text),
    "sellerName": IDL2.Text,
    "orderCount": IDL2.Nat,
    "stock": IDL2.Nat,
    "imageUrl": IDL2.Text,
    "hasSameDayDelivery": IDL2.Bool,
    "gender": IDL2.Text,
    "category": IDL2.Text,
    "sellerId": IDL2.Text,
    "price": IDL2.Nat,
    "isTrending": IDL2.Bool
  });
  const NotificationId2 = IDL2.Text;
  const Notification2 = IDL2.Record({
    "id": NotificationId2,
    "createdAt": IDL2.Int,
    "isRead": IDL2.Bool,
    "orderId": IDL2.Opt(IDL2.Text),
    "message": IDL2.Text,
    "sellerId": IDL2.Opt(IDL2.Text)
  });
  const Customer2 = IDL2.Record({
    "id": CustomerId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "phone": IDL2.Text
  });
  const SellerId2 = IDL2.Text;
  const Seller2 = IDL2.Record({
    "id": SellerId2,
    "isApproved": IDL2.Bool,
    "name": IDL2.Text,
    "createdAt": IDL2.Int,
    "businessName": IDL2.Text,
    "email": IDL2.Text,
    "address": IDL2.Text,
    "phone": IDL2.Text
  });
  const ProductEarningBreakdown2 = IDL2.Record({
    "productId": IDL2.Text,
    "productName": IDL2.Text,
    "orderCount": IDL2.Nat,
    "totalRevenue": IDL2.Nat
  });
  const SellerEarnings2 = IDL2.Record({
    "productBreakdown": IDL2.Vec(ProductEarningBreakdown2),
    "orderCount": IDL2.Nat,
    "totalEarnings": IDL2.Nat
  });
  const SellerInput2 = IDL2.Record({
    "name": IDL2.Text,
    "businessName": IDL2.Text,
    "email": IDL2.Text,
    "address": IDL2.Text,
    "phone": IDL2.Text
  });
  const Measurements2 = IDL2.Record({
    "weight": IDL2.Nat,
    "height": IDL2.Nat,
    "chest": IDL2.Nat,
    "waist": IDL2.Nat
  });
  const FitAndTryRequest2 = IDL2.Record({
    "productId": ProductId2,
    "measurements": Measurements2,
    "preferredSize": IDL2.Text
  });
  return IDL2.Service({
    "acceptOrder": IDL2.Func(
      [OrderId2, FulfillmentBy2, IDL2.Text],
      [IDL2.Variant({ "ok": Order2, "err": IDL2.Text })],
      []
    ),
    "addModelPhoto": IDL2.Func(
      [IDL2.Text, IDL2.Opt(IDL2.Text)],
      [IDL2.Variant({ "ok": ModelPhoto2, "err": IDL2.Text })],
      []
    ),
    "addNotification": IDL2.Func(
      [IDL2.Text, IDL2.Opt(IDL2.Text), IDL2.Opt(IDL2.Text)],
      [IDL2.Text],
      []
    ),
    "cancelOrder": IDL2.Func(
      [OrderId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "createCoupon": IDL2.Func(
      [CouponInput2],
      [IDL2.Variant({ "ok": Coupon2, "err": IDL2.Text })],
      []
    ),
    "createOrder": IDL2.Func(
      [
        IDL2.Vec(CartItem2),
        IDL2.Text,
        DeliveryOption2,
        PaymentMethod2,
        IDL2.Text,
        IDL2.Text,
        CustomerId2,
        IDL2.Opt(IDL2.Text)
      ],
      [Order2],
      []
    ),
    "createProduct": IDL2.Func(
      [ProductInput2],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    ),
    "deleteCoupon": IDL2.Func(
      [CouponId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteModelPhoto": IDL2.Func(
      [ModelPhotoId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteProduct": IDL2.Func(
      [ProductId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "getAllNotifications": IDL2.Func([], [IDL2.Vec(Notification2)], ["query"]),
    "getCoupon": IDL2.Func([IDL2.Text], [IDL2.Opt(Coupon2)], ["query"]),
    "getCouponOrderStats": IDL2.Func(
      [IDL2.Text],
      [
        IDL2.Opt(
          IDL2.Record({
            "couponCode": IDL2.Text,
            "totalOrders": IDL2.Nat,
            "successfulOrders": IDL2.Nat
          })
        )
      ],
      ["query"]
    ),
    "getCustomer": IDL2.Func([IDL2.Text], [IDL2.Opt(Customer2)], ["query"]),
    "getNewArrivals": IDL2.Func([], [IDL2.Vec(Product2)], ["query"]),
    "getNotifications": IDL2.Func(
      [IDL2.Opt(IDL2.Text)],
      [IDL2.Vec(Notification2)],
      ["query"]
    ),
    "getOrder": IDL2.Func([OrderId2], [IDL2.Opt(Order2)], ["query"]),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "getProducts": IDL2.Func([], [IDL2.Vec(Product2)], ["query"]),
    "getProductsBySeller": IDL2.Func([IDL2.Text], [IDL2.Vec(Product2)], ["query"]),
    "getSeller": IDL2.Func([SellerId2], [IDL2.Opt(Seller2)], ["query"]),
    "getSellerByEmailOrPhone": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Opt(Seller2)],
      ["query"]
    ),
    "getSellerEarnings": IDL2.Func([IDL2.Text], [SellerEarnings2], ["query"]),
    "listCoupons": IDL2.Func([], [IDL2.Vec(Coupon2)], ["query"]),
    "listModelPhotos": IDL2.Func([], [IDL2.Vec(ModelPhoto2)], ["query"]),
    "listOrders": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Tuple(OrderId2, Order2))],
      ["query"]
    ),
    "listOrdersByCustomer": IDL2.Func([IDL2.Text], [IDL2.Vec(Order2)], ["query"]),
    "listOrdersBySeller": IDL2.Func([IDL2.Text], [IDL2.Vec(Order2)], ["query"]),
    "listSellers": IDL2.Func([], [IDL2.Vec(Seller2)], ["query"]),
    "markNotificationRead": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "registerCustomer": IDL2.Func([IDL2.Text, IDL2.Text], [Customer2], []),
    "registerSeller": IDL2.Func(
      [SellerInput2],
      [IDL2.Variant({ "ok": Seller2, "err": IDL2.Text })],
      []
    ),
    "rejectOrder": IDL2.Func(
      [OrderId2, IDL2.Text],
      [IDL2.Variant({ "ok": Order2, "err": IDL2.Text })],
      []
    ),
    "removeSeller": IDL2.Func([SellerId2], [IDL2.Bool], []),
    "setNewArrival": IDL2.Func(
      [ProductId2, IDL2.Bool],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    ),
    "setProductTrending": IDL2.Func(
      [ProductId2, IDL2.Bool],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    ),
    "submitFitAndTryRequest": IDL2.Func([FitAndTryRequest2], [IDL2.Text], []),
    "toggleCoupon": IDL2.Func(
      [CouponId2],
      [IDL2.Variant({ "ok": Coupon2, "err": IDL2.Text })],
      []
    ),
    "updateOrderStatus": IDL2.Func(
      [OrderId2, OrderStatus2],
      [IDL2.Variant({ "ok": Order2, "err": IDL2.Text })],
      []
    ),
    "updateProduct": IDL2.Func(
      [ProductId2, ProductInput2],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class ExternalBlob {
  constructor(directURL, blob) {
    __publicField(this, "_blob");
    __publicField(this, "directURL");
    __publicField(this, "onProgress");
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }
  static fromURL(url) {
    return new ExternalBlob(url, null);
  }
  static fromBytes(blob) {
    const url = URL.createObjectURL(new Blob([
      new Uint8Array(blob)
    ], {
      type: "application/octet-stream"
    }));
    return new ExternalBlob(url, blob);
  }
  async getBytes() {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  getDirectURL() {
    return this.directURL;
  }
  withUploadProgress(onProgress) {
    this.onProgress = onProgress;
    return this;
  }
}
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["Delivered"] = "Delivered";
  OrderStatus2["Confirmed"] = "Confirmed";
  OrderStatus2["Placed"] = "Placed";
  OrderStatus2["Rejected"] = "Rejected";
  OrderStatus2["Accepted"] = "Accepted";
  OrderStatus2["Cancelled"] = "Cancelled";
  OrderStatus2["Processing"] = "Processing";
  OrderStatus2["Shipped"] = "Shipped";
  OrderStatus2["Pending"] = "Pending";
  return OrderStatus2;
})(OrderStatus || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async acceptOrder(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.acceptOrder(arg0, to_candid_FulfillmentBy_n1(this._uploadFile, this._downloadFile, arg1), arg2);
        return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.acceptOrder(arg0, to_candid_FulfillmentBy_n1(this._uploadFile, this._downloadFile, arg1), arg2);
      return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async addModelPhoto(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addModelPhoto(arg0, to_candid_opt_n20(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addModelPhoto(arg0, to_candid_opt_n20(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async addNotification(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.addNotification(arg0, to_candid_opt_n20(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n20(this._uploadFile, this._downloadFile, arg2));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addNotification(arg0, to_candid_opt_n20(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n20(this._uploadFile, this._downloadFile, arg2));
      return result;
    }
  }
  async cancelOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelOrder(arg0);
        return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelOrder(arg0);
      return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async createCoupon(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createCoupon(arg0);
        return from_candid_variant_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createCoupon(arg0);
      return from_candid_variant_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async createOrder(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    if (this.processError) {
      try {
        const result = await this.actor.createOrder(to_candid_vec_n26(this._uploadFile, this._downloadFile, arg0), arg1, to_candid_DeliveryOption_n29(this._uploadFile, this._downloadFile, arg2), to_candid_PaymentMethod_n31(this._uploadFile, this._downloadFile, arg3), arg4, arg5, arg6, to_candid_opt_n20(this._uploadFile, this._downloadFile, arg7));
        return from_candid_Order_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOrder(to_candid_vec_n26(this._uploadFile, this._downloadFile, arg0), arg1, to_candid_DeliveryOption_n29(this._uploadFile, this._downloadFile, arg2), to_candid_PaymentMethod_n31(this._uploadFile, this._downloadFile, arg3), arg4, arg5, arg6, to_candid_opt_n20(this._uploadFile, this._downloadFile, arg7));
      return from_candid_Order_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async createProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createProduct(to_candid_ProductInput_n33(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createProduct(to_candid_ProductInput_n33(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteCoupon(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteCoupon(arg0);
        return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteCoupon(arg0);
      return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteModelPhoto(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteModelPhoto(arg0);
        return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteModelPhoto(arg0);
      return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteProduct(arg0);
        return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteProduct(arg0);
      return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllNotifications() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllNotifications();
        return from_candid_vec_n38(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllNotifications();
      return from_candid_vec_n38(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCoupon(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCoupon(arg0);
        return from_candid_opt_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCoupon(arg0);
      return from_candid_opt_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCouponOrderStats(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCouponOrderStats(arg0);
        return from_candid_opt_n42(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCouponOrderStats(arg0);
      return from_candid_opt_n42(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCustomer(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCustomer(arg0);
        return from_candid_opt_n43(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCustomer(arg0);
      return from_candid_opt_n43(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNewArrivals() {
    if (this.processError) {
      try {
        const result = await this.actor.getNewArrivals();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNewArrivals();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNotifications(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getNotifications(to_candid_opt_n20(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n38(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNotifications(to_candid_opt_n20(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n38(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrder(arg0);
        return from_candid_opt_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProducts() {
    if (this.processError) {
      try {
        const result = await this.actor.getProducts();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProducts();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProductsBySeller(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProductsBySeller(arg0);
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProductsBySeller(arg0);
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSeller(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getSeller(arg0);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSeller(arg0);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSellerByEmailOrPhone(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getSellerByEmailOrPhone(arg0, arg1);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSellerByEmailOrPhone(arg0, arg1);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSellerEarnings(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getSellerEarnings(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSellerEarnings(arg0);
      return result;
    }
  }
  async listCoupons() {
    if (this.processError) {
      try {
        const result = await this.actor.listCoupons();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCoupons();
      return result;
    }
  }
  async listModelPhotos() {
    if (this.processError) {
      try {
        const result = await this.actor.listModelPhotos();
        return from_candid_vec_n48(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listModelPhotos();
      return from_candid_vec_n48(this._uploadFile, this._downloadFile, result);
    }
  }
  async listOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.listOrders();
        return from_candid_vec_n49(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listOrders();
      return from_candid_vec_n49(this._uploadFile, this._downloadFile, result);
    }
  }
  async listOrdersByCustomer(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listOrdersByCustomer(arg0);
        return from_candid_vec_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listOrdersByCustomer(arg0);
      return from_candid_vec_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async listOrdersBySeller(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listOrdersBySeller(arg0);
        return from_candid_vec_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listOrdersBySeller(arg0);
      return from_candid_vec_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async listSellers() {
    if (this.processError) {
      try {
        const result = await this.actor.listSellers();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listSellers();
      return result;
    }
  }
  async markNotificationRead(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.markNotificationRead(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markNotificationRead(arg0);
      return result;
    }
  }
  async registerCustomer(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.registerCustomer(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerCustomer(arg0, arg1);
      return result;
    }
  }
  async registerSeller(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.registerSeller(arg0);
        return from_candid_variant_n52(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerSeller(arg0);
      return from_candid_variant_n52(this._uploadFile, this._downloadFile, result);
    }
  }
  async rejectOrder(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.rejectOrder(arg0, arg1);
        return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.rejectOrder(arg0, arg1);
      return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeSeller(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeSeller(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeSeller(arg0);
      return result;
    }
  }
  async setNewArrival(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.setNewArrival(arg0, arg1);
        return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setNewArrival(arg0, arg1);
      return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async setProductTrending(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.setProductTrending(arg0, arg1);
        return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setProductTrending(arg0, arg1);
      return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitFitAndTryRequest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitFitAndTryRequest(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitFitAndTryRequest(arg0);
      return result;
    }
  }
  async toggleCoupon(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.toggleCoupon(arg0);
        return from_candid_variant_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.toggleCoupon(arg0);
      return from_candid_variant_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateOrderStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateOrderStatus(arg0, to_candid_OrderStatus_n53(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateOrderStatus(arg0, to_candid_OrderStatus_n53(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProduct(arg0, to_candid_ProductInput_n33(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProduct(arg0, to_candid_ProductInput_n33(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n35(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_CartItem_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_DeliveryOption_n12(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n13(_uploadFile, _downloadFile, value);
}
function from_candid_FulfillmentBy_n18(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n19(_uploadFile, _downloadFile, value);
}
function from_candid_ModelPhoto_n22(_uploadFile, _downloadFile, value) {
  return from_candid_record_n23(_uploadFile, _downloadFile, value);
}
function from_candid_Notification_n39(_uploadFile, _downloadFile, value) {
  return from_candid_record_n40(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n6(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n7(_uploadFile, _downloadFile, value);
}
function from_candid_Order_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentMethod_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_Product_n36(_uploadFile, _downloadFile, value) {
  return from_candid_record_n37(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n11(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n17(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_FulfillmentBy_n18(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n41(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n42(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n43(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n45(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Order_n4(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n46(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Product_n36(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n47(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n8(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    productId: value.productId,
    deliveryOption: from_candid_DeliveryOption_n12(_uploadFile, _downloadFile, value.deliveryOption),
    quantity: value.quantity,
    selectedSize: value.selectedSize
  };
}
function from_candid_record_n23(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    createdAt: value.createdAt,
    imageUrl: value.imageUrl,
    caption: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.caption))
  };
}
function from_candid_record_n37(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    fulfillmentBy: from_candid_FulfillmentBy_n18(_uploadFile, _downloadFile, value.fulfillmentBy),
    subcategory: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.subcategory)),
    name: value.name,
    createdAt: value.createdAt,
    isNewArrival: value.isNewArrival,
    description: value.description,
    hasFitAndTry: value.hasFitAndTry,
    sizes: value.sizes,
    sellerName: value.sellerName,
    orderCount: value.orderCount,
    stock: value.stock,
    imageUrl: value.imageUrl,
    hasSameDayDelivery: value.hasSameDayDelivery,
    gender: value.gender,
    category: value.category,
    sellerId: value.sellerId,
    price: value.price,
    isTrending: value.isTrending
  };
}
function from_candid_record_n40(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    createdAt: value.createdAt,
    isRead: value.isRead,
    orderId: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.orderId)),
    message: value.message,
    sellerId: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.sellerId))
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    customerName: value.customerName,
    status: from_candid_OrderStatus_n6(_uploadFile, _downloadFile, value.status),
    couponCode: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.couponCode)),
    total: value.total,
    paymentMethod: from_candid_PaymentMethod_n9(_uploadFile, _downloadFile, value.paymentMethod),
    customerPhone: value.customerPhone,
    discountAmount: record_opt_to_undefined(from_candid_opt_n11(_uploadFile, _downloadFile, value.discountAmount)),
    createdAt: value.createdAt,
    deliveryOption: from_candid_DeliveryOption_n12(_uploadFile, _downloadFile, value.deliveryOption),
    shippingAddress: value.shippingAddress,
    customerId: value.customerId,
    items: from_candid_vec_n14(_uploadFile, _downloadFile, value.items),
    fulfillmentChoice: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.fulfillmentChoice))
  };
}
function from_candid_tuple_n50(_uploadFile, _downloadFile, value) {
  return [
    value[0],
    from_candid_Order_n4(_uploadFile, _downloadFile, value[1])
  ];
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "Card" in value ? "Card" : "CashOnDelivery" in value ? "CashOnDelivery" : value;
}
function from_candid_variant_n13(_uploadFile, _downloadFile, value) {
  return "SameDay" in value ? "SameDay" : "NextDay" in value ? "NextDay" : "Standard" in value ? "Standard" : value;
}
function from_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return "AdminFulfilled" in value ? "AdminFulfilled" : "SellerFulfilled" in value ? "SellerFulfilled" : value;
}
function from_candid_variant_n21(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_ModelPhoto_n22(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n24(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n25(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n3(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_Order_n4(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n35(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_Product_n36(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n52(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n7(_uploadFile, _downloadFile, value) {
  return "Delivered" in value ? "Delivered" : "Confirmed" in value ? "Confirmed" : "Placed" in value ? "Placed" : "Rejected" in value ? "Rejected" : "Accepted" in value ? "Accepted" : "Cancelled" in value ? "Cancelled" : "Processing" in value ? "Processing" : "Shipped" in value ? "Shipped" : "Pending" in value ? "Pending" : value;
}
function from_candid_vec_n14(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CartItem_n15(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n38(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Notification_n39(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n44(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Product_n36(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n48(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ModelPhoto_n22(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n49(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_tuple_n50(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n51(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Order_n4(_uploadFile, _downloadFile, x));
}
function to_candid_CartItem_n27(_uploadFile, _downloadFile, value) {
  return to_candid_record_n28(_uploadFile, _downloadFile, value);
}
function to_candid_DeliveryOption_n29(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n30(_uploadFile, _downloadFile, value);
}
function to_candid_FulfillmentBy_n1(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function to_candid_OrderStatus_n53(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n54(_uploadFile, _downloadFile, value);
}
function to_candid_PaymentMethod_n31(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function to_candid_ProductInput_n33(_uploadFile, _downloadFile, value) {
  return to_candid_record_n34(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n20(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n28(_uploadFile, _downloadFile, value) {
  return {
    productId: value.productId,
    deliveryOption: to_candid_DeliveryOption_n29(_uploadFile, _downloadFile, value.deliveryOption),
    quantity: value.quantity,
    selectedSize: value.selectedSize
  };
}
function to_candid_record_n34(_uploadFile, _downloadFile, value) {
  return {
    fulfillmentBy: to_candid_FulfillmentBy_n1(_uploadFile, _downloadFile, value.fulfillmentBy),
    subcategory: value.subcategory ? candid_some(value.subcategory) : candid_none(),
    name: value.name,
    description: value.description,
    hasFitAndTry: value.hasFitAndTry,
    sizes: value.sizes,
    sellerName: value.sellerName,
    stock: value.stock,
    imageUrl: value.imageUrl,
    hasSameDayDelivery: value.hasSameDayDelivery,
    gender: value.gender,
    category: value.category,
    sellerId: value.sellerId,
    price: value.price,
    isTrending: value.isTrending
  };
}
function to_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return value == "AdminFulfilled" ? {
    AdminFulfilled: null
  } : value == "SellerFulfilled" ? {
    SellerFulfilled: null
  } : value;
}
function to_candid_variant_n30(_uploadFile, _downloadFile, value) {
  return value == "SameDay" ? {
    SameDay: null
  } : value == "NextDay" ? {
    NextDay: null
  } : value == "Standard" ? {
    Standard: null
  } : value;
}
function to_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return value == "Card" ? {
    Card: null
  } : value == "CashOnDelivery" ? {
    CashOnDelivery: null
  } : value;
}
function to_candid_variant_n54(_uploadFile, _downloadFile, value) {
  return value == "Delivered" ? {
    Delivered: null
  } : value == "Confirmed" ? {
    Confirmed: null
  } : value == "Placed" ? {
    Placed: null
  } : value == "Rejected" ? {
    Rejected: null
  } : value == "Accepted" ? {
    Accepted: null
  } : value == "Cancelled" ? {
    Cancelled: null
  } : value == "Processing" ? {
    Processing: null
  } : value == "Shipped" ? {
    Shipped: null
  } : value == "Pending" ? {
    Pending: null
  } : value;
}
function to_candid_vec_n26(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_CartItem_n27(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  ExternalBlob as E,
  OrderStatus as O,
  useQuery as a,
  createActor as c,
  useActor as u
};
