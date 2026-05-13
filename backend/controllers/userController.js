const userService = require('../services/userService');

async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania użytkowników',
    });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'Użytkownik nie został znaleziony',
      });
    }

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania użytkownika',
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, roleId, isActive } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      roleId === undefined ||
      isActive === undefined
    ) {
      return res.status(400).json({
        error: 'firstName, lastName, email, roleId i isActive są wymagane',
      });
    }

    const updatedUser = await userService.updateUser(id, {
      firstName,
      lastName,
      email,
      roleId,
      isActive,
    });

    if (!updatedUser) {
      return res.status(404).json({
        error: 'Użytkownik nie został znaleziony',
      });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd aktualizacji użytkownika',
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({
        error: 'Użytkownik nie został znaleziony',
      });
    }

    return res.json({
      message: 'Użytkownik został usunięty',
      user: deletedUser,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd usuwania użytkownika',
    });
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};