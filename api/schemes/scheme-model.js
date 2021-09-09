const db = require('../../data/db-config')

// const {schemes} = require('../../data/seeds/01-schemes')

async function find() {
  return db('schemes AS sc')
    .leftJoin('steps AS st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.*')
    .count('st.step_id AS number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
}

async function findById(scheme_id) {
  const rows = await db('schemes AS sc')
    .leftJoin('steps AS st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .select('sc.scheme_id', 'sc.scheme_name', 'st.*')
    .orderBy('st.step_number', 'asc')

  const scheme = {
    scheme_id: rows[0].scheme_id
    === null
      ? scheme_id
      : rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: []
  }

  if (rows[0].step_id
    !== null) {
    rows.forEach(step => {
      if (!rows.step_id) {
        scheme.steps.push({
          step_id: step.step_id,
          step_number: step.step_number,
          instructions: step.instructions
        })
      }
    })
  }

  return scheme
}

async function findSteps(scheme_id) {
  const steps = await db('schemes AS sc')
    .leftJoin('steps AS st', 'sc.scheme_id', 'st.scheme_id')
    .select('st.*', 'sc.scheme_name')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')

  if (steps[0].scheme_id
    === null) {
    return []
  }
  if (steps[0].scheme_id
    !== null) {
    return steps.map(step => (
      {
        step_id: step.step_id,
        step_number: step.step_number,
        instructions: step.instructions,
        scheme_name: step.scheme_name
      }
    ))
  }
}

async function add(scheme) {
  const added = await db('schemes')
    .insert(scheme)

  return db('schemes')
    .where('scheme_id', added)
    .first()
}

async function addStep(scheme_id, step) {
  const newStep = {
    step_number: step.step_number,
    instructions: step.instructions,
    scheme_id: scheme_id
  }

  return db('steps')
    .insert(newStep)
    .then(() => findSteps(scheme_id))
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep
}
