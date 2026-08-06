import Joi from 'joi';

function tryParseJSON(value) {
  if (!value) return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
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
