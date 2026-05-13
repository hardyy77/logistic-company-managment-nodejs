const trailerService = require('../services/trailerService');

async function getTrailers(req, res) {
  try {
    const trailers = await trailerService.getAllTrailers();
    return res.json(trailers);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania naczep',
    });
  }
}

async function getTrailer(req, res) {
  try {
    const { id } = req.params;
    const trailer = await trailerService.getTrailerById(id);

    if (!trailer) {
      return res.status(404).json({
        error: 'Naczepa nie została znaleziona',
      });
    }

    return res.json(trailer);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania naczepy',
    });
  }
}

async function createTrailer(req, res) {
  try {
    const {
      registrationNumber,
      trailerType,
      capacityKg,
      volumeM3,
      status,
      inspectionValidUntil,
    } = req.body;

    if (!registrationNumber || !trailerType || capacityKg === undefined) {
      return res.status(400).json({
        error: 'registrationNumber, trailerType i capacityKg są wymagane',
      });
    }

    const trailer = await trailerService.createTrailer({
      registrationNumber,
      trailerType,
      capacityKg,
      volumeM3,
      status,
      inspectionValidUntil,
    });

    return res.status(201).json(trailer);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd tworzenia naczepy',
    });
  }
}

async function updateTrailer(req, res) {
  try {
    const { id } = req.params;
    const {
      registrationNumber,
      trailerType,
      capacityKg,
      volumeM3,
      status,
      inspectionValidUntil,
    } = req.body;

    if (!registrationNumber || !trailerType || capacityKg === undefined || !status) {
      return res.status(400).json({
        error: 'registrationNumber, trailerType, capacityKg i status są wymagane',
      });
    }

    const trailer = await trailerService.updateTrailer(id, {
      registrationNumber,
      trailerType,
      capacityKg,
      volumeM3,
      status,
      inspectionValidUntil,
    });

    if (!trailer) {
      return res.status(404).json({
        error: 'Naczepa nie została znaleziona',
      });
    }

    return res.json(trailer);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd aktualizacji naczepy',
    });
  }
}

async function deleteTrailer(req, res) {
  try {
    const { id } = req.params;
    const trailer = await trailerService.deleteTrailer(id);

    if (!trailer) {
      return res.status(404).json({
        error: 'Naczepa nie została znaleziona',
      });
    }

    return res.json({
      message: 'Naczepa została usunięta',
      trailer,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd usuwania naczepy',
    });
  }
}

module.exports = {
  getTrailers,
  getTrailer,
  createTrailer,
  updateTrailer,
  deleteTrailer,
};