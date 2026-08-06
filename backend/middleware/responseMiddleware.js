// Standardize API responses: if handler returns non-envelope object, wrap it.
export default function responseMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    if (payload && Object.prototype.hasOwnProperty.call(payload, 'success')) {
      return originalJson(payload);
    }
    // wrap non-enveloped responses
    return originalJson({ success: true, data: payload });
  };
  next();
}
