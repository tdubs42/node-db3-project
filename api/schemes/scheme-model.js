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
  const steps = await db('schemes AS sc')
    .leftJoin('steps AS st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .select('sc.scheme_id', 'sc.scheme_name', 'sc.*')
    .orderBy('st.step_number')

  const result = (
    {
      scheme_id: steps[0].scheme_id
      === null
        ? scheme_id
        : steps[0].scheme_id,
      scheme_name: steps[0].scheme_name,
      steps: []
    }
  )

  steps.forEach(step => {
    if (step.step_id) {
      result.steps.push({
        step_id: step.step_id,
        step_number: step.step_number,
        instructions: step.instructions,
      })
    }
  })

  return result
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

  return findById(added)
}

async function addStep(scheme_id, step) {

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
