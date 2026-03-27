import Joi from "joi";
const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  profilePicture: Joi.string().optional(),
  bio: Joi.string().max(200).optional(),
});

export const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
