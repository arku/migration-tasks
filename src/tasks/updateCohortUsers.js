const firebase = require('firebase')
const { querySnapToDocs } = require('../../lib/util')

const CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT,
}

firebase.initializeApp(CONFIG)

const db = firebase.firestore()

const getCohortIds = () =>
  db.collection('cohorts')
    .get()
    .then(querySnapToDocs)
    .then(cohorts => cohorts.map(cohort => cohort.id))

const updateCohortUsers = (cohortId, obj) => {
  const collectionRef = `/cohorts/${cohortId}/users`
  const batch = db.batch()

  return db.collection(collectionRef)
    .get()
    .then((cohortUsers) => {
      cohortUsers.forEach((cohortUser) => {
        batch.update(cohortUser.ref, obj)
      })
    })
    .then(() => batch.commit())
}

getCohortIds()
  .then(cohortIds => {
    const promises = cohortIds.map(cohortId =>
      updateCohortUsers(cohortId, { active: true })
    )
    return Promise.all(promises)
  })
  .then(() => console.log('DONE!'))
  .catch(console.error)
