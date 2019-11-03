const {getClaps, addClaps, createConnection, deleteClaps} = require('./modules/mongodb');

exports.handler = async (event) => {
    // add post check
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Invalid API call'
        }
    }
    const { pageId, userId, isDelete } = JSON.parse(event.body)
    const insertDoc = { pageId: pageId, userId: userId }

    const { collection: dbCollection, connection } = await createConnection();
    let result;
    if (isDelete) {
        result = await deleteClaps(dbCollection, insertDoc).then(() => {
            return getClaps(dbCollection, pageId)
        });
    } else {
        result = await addClaps(dbCollection, insertDoc).then(() => {
            return getClaps(dbCollection, pageId)
        });
    }
    connection.close();
    return {
        statusCode: 200,
        body: JSON.stringify({
            count: result.length || 0,
            isClicked: !isDelete
        })
    }
}
