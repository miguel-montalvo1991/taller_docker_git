const express = require('express');
const { Pool } = require('pg');
function validarUsuario(body) {
  const { nombre, email } = body;
  const errores = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    errores.push('El campo "nombre" es obligatorio y no puede estar vacío');
  } else if (nombre.trim().length > 100) {
    errores.push('El campo "nombre" no puede superar 100 caracteres');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errores.push('El campo "email" es obligatorio y debe tener un formato válido');
  }

  return errores;
}

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'apidb'
});




// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'OK', servicio: 'API Node.js', timestamp: new Date() });
});

// GET /usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /usuarios
app.post('/usuarios', async (req, res) => {
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const { nombre, email } = req.body;
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
      [nombre.trim(), email.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // el UNIQUE de email en la tabla puede seguir lanzando error de BD
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /usuarios/:id
app.put('/usuarios/:id', async (req, res) => {
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const { id } = req.params;
    const { nombre, email } = req.body;
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *',
      [nombre, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Usuario con id ${id} no existe` });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /usuarios/:id
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Usuario con id ${id} no existe` });
    }
    res.json({ mensaje: `Usuario ${id} eliminado`, usuario: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});