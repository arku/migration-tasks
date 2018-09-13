exports.docSnapToDoc = docSnap =>
  Object.assign(
    { id: docSnap.id },
    docSnap.exists ? docSnap.data() : {}
  );

exports.querySnapToDocs = querySnap => (
  querySnap && !querySnap.empty
    ? querySnap.docs.map(exports.docSnapToDoc)
    : []
);
