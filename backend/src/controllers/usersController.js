const User = require('../models/User');
const { createUserSchema, updateUserSchema } = require('../validators/userValidator');

async function listUsers(req, res, next) {
  try {
    // Basic filtering / pagination / search / sort support (query params)
    const { page = 1, limit = 100, search, role, isActive, sort } = req.query;
    const q = {};
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) q.role = role;
    if (typeof isActive !== 'undefined') q.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(q)
      .sort(sort ? { [sort]: 1 } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    // Return plain array for frontend compatibility
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    // sanitize nested objects (remove _id/id that may come from frontend)
    if (req.body && typeof req.body === 'object') {
      if (req.body.address && typeof req.body.address === 'object') {
        const { _id, id, ...restAddr } = req.body.address;
        req.body.address = restAddr;
      }
      if (req.body.company && typeof req.body.company === 'object') {
        const { _id, id, ...restComp } = req.body.company;
        req.body.company = restComp;
      }
    }

    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    // convert availableSlots strings to Date objects
    const payload = { ...value };
    if (payload.availableSlots) {
      payload.availableSlots = payload.availableSlots.map(s => new Date(s));
    }

    const user = new User(payload);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function patchUser(req, res, next) {
  try {
    // --- sanitize nested objects to remove mongoose-specific fields that break validation ---
    if (req.body && typeof req.body === 'object') {
      if (req.body.address && typeof req.body.address === 'object') {
        const { _id, id, ...restAddr } = req.body.address;
        req.body.address = restAddr;
      }
      if (req.body.company && typeof req.body.company === 'object') {
        const { _id, id, ...restComp } = req.body.company;
        req.body.company = restComp;
      }
    }
    console.log('PATCH sanitized body:', JSON.stringify(req.body));

    const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    const payload = { ...value };
    if (payload.availableSlots) payload.availableSlots = payload.availableSlots.map(s => new Date(s));

    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: req.params.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, createUser, patchUser, removeUser };
