import generateToken from '../utils/generateToken.js';

global.mockDB = global.mockDB || {
  users: [],
  watchlists: []
};
let userIdCounter = 1;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  const userExists = global.mockDB.users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    _id: String(userIdCounter++),
    name,
    email,
    password, // plain text for mock
    role: 'user'
  };
  
  global.mockDB.users.push(user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = global.mockDB.users.find(u => u.email === email);

  if (user && user.password === password) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getUserProfile = async (req, res) => {
  const user = global.mockDB.users.find(u => u._id === String(req.user._id));

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};
