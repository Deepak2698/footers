import Joi from 'joi';

// Only multipart/form-data requests need this: array/object fields (e.g. `sizes`,
// `images`) arrive as JSON-encoded strings because FormData can't carry real types.
// Only attempt to parse values that actually look like a JSON array or object —
// otherwise a plain numeric-looking string field (a phone number, a pincode, an
// order note that's just digits) would be silently coerced into a number and then
// fail a Joi `.string()` schema on a perfectly valid JSON request body.
function tryParseJSON(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    return value;
  }
}

export function validateSchema(schemas) {
  return (req, res, next) => {
    try {
      const toValidate = {};
      if (schemas.params) toValidate.params = req.params;
      if (schemas.query) toValidate.query = req.query;
      if (schemas.body) {
        // parse potential JSON strings from form-data
        const parsedBody = {};
        for (const k of Object.keys(req.body || {})) {
          parsedBody[k] = tryParseJSON(req.body[k]);
        }
        toValidate.body = parsedBody;
      }

      const combined = {};
      if (schemas.params) combined.params = schemas.params;
      if (schemas.query) combined.query = schemas.query;
      if (schemas.body) combined.body = schemas.body;

      const schema = Joi.object(combined);
      const { error } = schema.validate(toValidate, { abortEarly: false, allowUnknown: true });
      if (error) {
        return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });
      }
      // attach parsed body back to req.body for downstream handlers
      if (schemas.body) req.body = toValidate.body;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export default validateSchema;
