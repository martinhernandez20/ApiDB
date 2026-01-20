const express = require('express');
const pool = require('./db/db');

const app = express();
app.use(express.json());



//TEST
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error de conexión' });
  }
});

//usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, rut, nombre, departamento FROM usuario_asignado ORDER BY id'
    );

    res.json({
      total: result.rowCount,
      usuarios: result.rows
    });
  } catch (error) {
    console.error('ERROR /usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});


//EQUIPOS
app.get('/equipos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.marca,
        e.fecha_compra,
        e.estado,
        u.id AS usuario_id,
        u.nombre AS usuario,
        u.departamento
      FROM equipo e
      JOIN usuario_asignado u
        ON e.usuario_asignado = u.id
      ORDER BY e.id
    `);

    res.json({
      total: result.rowCount,
      equipos: result.rows
    });
  } catch (error) {
    console.error('ERROR /equipos:', error.message);
    res.status(500).json({ error: error.message });
  }
});

//COMPONENTES
app.get('/componentes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.tipo,
        c.especificaciones,
        c.estado,
        e.id AS equipo_id,
        e.marca
      FROM componente c
      JOIN equipo e ON c.equipo = e.id
      ORDER BY c.id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//HISTORIAL
app.get('/historial', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.id,
        h.fecha,
        h.tipo_evento,
        h.descripcion,
        h.estado,
        e.id AS equipo_id,
        e.marca
      FROM historial h
      JOIN equipo e ON h.equipo = e.id
      ORDER BY h.fecha DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//PROBLEMAS
app.get('/problemas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.descripcion,
        p.fecha,
        p.estado,
        p.prioridad,
        e.id AS equipo_id,
        e.marca
      FROM problema p
      JOIN equipo e ON p.equipo = e.id
      ORDER BY p.fecha DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//debug tablas
app.get('/debug-tablas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});


app.listen(3000, () => {
  console.log('Servidor listo');
});
