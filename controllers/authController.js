const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        error: 'firstName, lastName, email, password i role są wymagane',
      });
    }

    const existingUser = await authService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: 'Użytkownik z takim adresem email już istnieje',
      });
    }

    const roleData = await authService.getRoleByName(role);

    if (!roleData) {
      return res.status(400).json({
        error: 'Nieprawidłowa rola użytkownika',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      roleId: roleData.id,
    });

    return res.status(201).json({
      message: 'Użytkownik został zarejestrowany',
      user,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd rejestracji użytkownika',
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email i password są wymagane',
      });
    }

    const user = await authService.findUserByEmail(email);

    if (!user || !user.password_hash) {
      return res.status(401).json({
        error: 'Nieprawidłowy email lub hasło',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: 'Konto użytkownika jest nieaktywne',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Nieprawidłowy email lub hasło',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Logowanie zakończone sukcesem',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd logowania',
    });
  }
}

module.exports = {
  register,
  login,
};